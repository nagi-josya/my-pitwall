using System.Globalization;
using System.Text.Json;
using System.Text.RegularExpressions;
using MyPitwall.Application.Abstractions;
using MyPitwall.Application.OpenF1;

namespace MyPitwall.Infrastructure;

public sealed class WikipediaDriverCareerProvider : IDriverCareerProvider
{
    private readonly HttpClient _httpClient;
    private readonly ManualDriverCareerProvider _fallback;
    private readonly Dictionary<string, DriverCareerInfo> _cache = new();
    private readonly object _lock = new();

    private static readonly Regex PodiumsF1StatRegex = new(@"^\|\s*podiums\s*=\s*\{\{F1stat\|(\w+)\|podiums\}\}", RegexOptions.Multiline | RegexOptions.IgnoreCase);
    private static readonly Regex PodiumsPlainRegex = new(@"^\|\s*podiums\s*=\s*(\d+)", RegexOptions.Multiline | RegexOptions.IgnoreCase);
    private static readonly Regex FirstRaceRegex = new(@"^\|\s*first_race\s*=\s*(?:\[\[)?(\d{4})", RegexOptions.Multiline | RegexOptions.IgnoreCase);

    public WikipediaDriverCareerProvider(ManualDriverCareerProvider fallback)
    {
        _httpClient = new HttpClient
        {
            BaseAddress = new Uri("https://en.wikipedia.org"),
            Timeout = TimeSpan.FromSeconds(10)
        };
        _fallback = fallback;
    }

    public async Task<DriverCareerInfo?> GetCareerAsync(string fullName, CancellationToken cancellationToken = default)
    {
        lock (_lock)
        {
            if (_cache.TryGetValue(fullName, out var cached))
                return cached;
        }

        try
        {
            var info = await FetchFromWikipediaAsync(fullName, cancellationToken);
            if (info is not null)
            {
                lock (_lock) { _cache[fullName] = info; }
                return info;
            }
        }
        catch
        {
            // Wikipedia failed; fall through to manual
        }

        var fallback = await _fallback.GetCareerAsync(fullName, cancellationToken);
        if (fallback is not null)
        {
            lock (_lock) { _cache[fullName] = fallback; }
        }

        return fallback;
    }

    private async Task<DriverCareerInfo?> FetchFromWikipediaAsync(string fullName, CancellationToken ct)
    {
        var candidates = ToWikipediaTitles(fullName);

        foreach (var title in candidates)
        {
            var url = $"/w/api.php?action=parse&page={Uri.EscapeDataString(title)}&prop=wikitext&format=json";

            using var response = await _httpClient.GetAsync(url, ct);
            if (!response.IsSuccessStatusCode)
                continue;

            using var doc = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync(ct), cancellationToken: ct);
            if (doc.RootElement.TryGetProperty("error", out _))
                continue;

            if (!doc.RootElement.TryGetProperty("parse", out var parse)
                || !parse.TryGetProperty("wikitext", out var wikitext)
                || !wikitext.TryGetProperty("*", out var textProp))
            {
                continue;
            }

            var wikitextStr = textProp.GetString();
            if (string.IsNullOrEmpty(wikitextStr))
                continue;

            var podiums = 0;
            var debutYear = 0;

            var f1statMatch = PodiumsF1StatRegex.Match(wikitextStr);
            if (f1statMatch.Success)
            {
                var code = f1statMatch.Groups[1].Value;
                podiums = await ResolveF1StatPodiumsAsync(code, ct);
            }

            if (podiums == 0)
            {
                var plainMatch = PodiumsPlainRegex.Match(wikitextStr);
                if (plainMatch.Success)
                    podiums = int.Parse(plainMatch.Groups[1].Value);
            }

            var entryMatch = FirstRaceRegex.Match(wikitextStr);
            if (entryMatch.Success)
                debutYear = int.Parse(entryMatch.Groups[1].Value);

            var manual = await _fallback.GetCareerAsync(fullName, ct);
            var highestFinish = podiums > 0 ? 1 : (manual?.HighestFinish ?? 0);
            var championshipYears = manual?.ChampionshipYears;

            return new DriverCareerInfo(debutYear, podiums, highestFinish, championshipYears);
        }

        return null;
    }

    private async Task<int> ResolveF1StatPodiumsAsync(string code, CancellationToken ct)
    {
        try
        {
            var url = $"/w/api.php?action=expandtemplates&text={Uri.EscapeDataString("{{F1stat|" + code + "|podiums}}")}&format=json";
            using var response = await _httpClient.GetAsync(url, ct);
            if (!response.IsSuccessStatusCode)
                return 0;

            using var doc = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync(ct), cancellationToken: ct);
            if (doc.RootElement.TryGetProperty("expandtemplates", out var et)
                && et.TryGetProperty("*", out var val)
                && int.TryParse(val.GetString(), out var podiums))
            {
                return podiums;
            }
        }
        catch
        {
            // fall through
        }

        return 0;
    }

    private static List<string> ToWikipediaTitles(string openF1Name)
    {
        var lower = openF1Name.ToLowerInvariant();
        var titleInfo = CultureInfo.InvariantCulture.TextInfo;
        var proper = titleInfo.ToTitleCase(lower);

        var parts = proper.Split(' ');
        for (var i = 0; i < parts.Length; i++)
        {
            var p = parts[i];
            if (p.Length <= 2 && i > 0)
                parts[i] = p.ToLowerInvariant();
        }

        var baseTitle = string.Join("_", parts);
        var titles = new List<string> { baseTitle };

        if (openF1Name.StartsWith("Kimi ", StringComparison.OrdinalIgnoreCase))
            titles.Add("Andrea_Kimi_Antonelli");

        if (openF1Name.StartsWith("Nyck ", StringComparison.OrdinalIgnoreCase))
            titles.Add("Nyck_de_Vries");

        if (openF1Name.StartsWith("Zhou ", StringComparison.OrdinalIgnoreCase))
            titles.Add("Zhou_Guanyu");

        return titles;
    }
}

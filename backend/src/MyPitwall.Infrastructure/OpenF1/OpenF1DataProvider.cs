using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using MyPitwall.Application.Abstractions;
using MyPitwall.Application.OpenF1;

namespace MyPitwall.Infrastructure.OpenF1;

public sealed class OpenF1DataProvider(HttpClient httpClient) : IF1DataProvider
{
    private const int MaxRetries = 5;

    public async Task<IReadOnlyList<OpenF1SessionDto>> GetSessionsAsync(int year, int? meetingKey = null, CancellationToken cancellationToken = default)
    {
        var url = meetingKey.HasValue
            ? $"sessions?year={year}&meeting_key={meetingKey.Value}"
            : $"sessions?year={year}";

        var sessions = await GetAsyncWithRetry<IReadOnlyList<OpenF1SessionResponse>>(url, cancellationToken);

        return (IReadOnlyList<OpenF1SessionDto>?)sessions?
            .Select(session => new OpenF1SessionDto(
                session.SessionKey,
                session.MeetingKey,
                session.Year,
                session.CountryName ?? "Unknown",
                session.Location ?? "Unknown",
                session.SessionName ?? "Unknown",
                session.StartDate,
                session.EndDate))
            .ToList() ?? Array.Empty<OpenF1SessionDto>();
    }

    public async Task<IReadOnlyList<OpenF1DriverDto>> GetDriversAsync(int sessionKey, CancellationToken cancellationToken)
    {
        var drivers = await GetAsyncWithRetry<IReadOnlyList<OpenF1DriverResponse>>(
            $"drivers?session_key={sessionKey}",
            cancellationToken);

        return (IReadOnlyList<OpenF1DriverDto>?)drivers?
            .Where(driver => driver.DriverNumber is not null)
            .Select(driver => new OpenF1DriverDto(
                driver.DriverNumber!.Value,
                driver.NameAcronym ?? driver.BroadcastName ?? driver.DriverNumber.Value.ToString(),
                driver.FullName ?? driver.BroadcastName ?? "Unknown Driver",
                driver.TeamName ?? "Unknown Team",
                driver.TeamColour ?? "FFFFFF"))
            .ToList() ?? Array.Empty<OpenF1DriverDto>();
    }

    public async Task<IReadOnlyList<OpenF1PositionDto>> GetPositionsAsync(int sessionKey, CancellationToken cancellationToken)
    {
        var positions = await GetAsyncWithRetry<IReadOnlyList<OpenF1PositionResponse>>(
            $"position?session_key={sessionKey}",
            cancellationToken);

        return (IReadOnlyList<OpenF1PositionDto>?)positions?
            .Select(p => new OpenF1PositionDto(p.DriverNumber, p.Position, p.Date))
            .ToList() ?? Array.Empty<OpenF1PositionDto>();
    }

    public async Task<IReadOnlyList<OpenF1IntervalDto>> GetIntervalsAsync(int sessionKey, CancellationToken cancellationToken)
    {
        var intervals = await GetAsyncWithRetry<IReadOnlyList<OpenF1IntervalResponse>>(
            $"intervals?session_key={sessionKey}",
            cancellationToken);

        return (IReadOnlyList<OpenF1IntervalDto>?)intervals?
            .Select(i => new OpenF1IntervalDto(
                i.DriverNumber,
                SafeParseDouble(i.GapToLeader),
                SafeParseDouble(i.Interval),
                i.Date))
            .ToList() ?? Array.Empty<OpenF1IntervalDto>();
    }

    public async Task<IReadOnlyList<ChampionshipDriverDto>> GetChampionshipDriversAsync(int sessionKey, CancellationToken cancellationToken)
    {
        var standings = await GetAsyncWithRetry<IReadOnlyList<ChampionshipDriverResponse>>(
            $"championship_drivers?session_key={sessionKey}",
            cancellationToken);

        return (IReadOnlyList<ChampionshipDriverDto>?)standings?
            .Select(s => new ChampionshipDriverDto(
                s.DriverNumber,
                s.PositionCurrent,
                s.PointsCurrent))
            .ToList() ?? Array.Empty<ChampionshipDriverDto>();
    }

    public async Task<IReadOnlyList<ChampionshipTeamDto>> GetChampionshipTeamsAsync(int sessionKey, CancellationToken cancellationToken)
    {
        var standings = await GetAsyncWithRetry<IReadOnlyList<ChampionshipTeamResponse>>(
            $"championship_teams?session_key={sessionKey}",
            cancellationToken);

        return (IReadOnlyList<ChampionshipTeamDto>?)standings?
            .Select(s => new ChampionshipTeamDto(
                s.TeamName,
                s.PositionCurrent,
                s.PointsCurrent))
            .ToList() ?? Array.Empty<ChampionshipTeamDto>();
    }

    public async Task<string?> CheckAvailabilityAsync(CancellationToken cancellationToken = default)
    {
        var sessions = await GetAsyncWithRetry<IReadOnlyList<OpenF1SessionResponse>>("sessions?year=2024", cancellationToken);

        if (sessions is not null)
            return null;

        using var response = await httpClient.GetAsync("sessions?year=2024", cancellationToken);

        if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
        {
            var body = await response.Content.ReadFromJsonAsync<OpenF1ErrorResponse>(cancellationToken: cancellationToken);
            return body?.Detail ?? "OpenF1 API is currently unavailable (unauthorized).";
        }

        return $"OpenF1 API returned unexpected status: {response.StatusCode}";
    }

    public async Task<IReadOnlyList<OpenF1StintDto>> GetStintsAsync(int sessionKey, CancellationToken cancellationToken)
    {
        var stints = await GetAsyncWithRetry<IReadOnlyList<StintResponse>>(
            $"stints?session_key={sessionKey}",
            cancellationToken);

        return (IReadOnlyList<OpenF1StintDto>?)stints?
            .Select(s => new OpenF1StintDto(
                s.DriverNumber,
                s.Compound,
                s.LapStart,
                s.LapEnd,
                s.TyreAgeAtStart))
            .ToList() ?? Array.Empty<OpenF1StintDto>();
    }

    public async Task<IReadOnlyList<OpenF1RaceControlDto>> GetRaceControlEventsAsync(int sessionKey, CancellationToken cancellationToken)
    {
        var events = await GetAsyncWithRetry<IReadOnlyList<RaceControlResponse>>(
            $"race_control?session_key={sessionKey}",
            cancellationToken);

        return (IReadOnlyList<OpenF1RaceControlDto>?)events?
            .Select(e => new OpenF1RaceControlDto(
                e.DriverNumber,
                e.Category,
                e.Message,
                e.Date))
            .ToList() ?? Array.Empty<OpenF1RaceControlDto>();
    }

    private sealed record RaceControlResponse(
        [property: JsonPropertyName("driver_number")] int? DriverNumber,
        [property: JsonPropertyName("category")] string Category,
        [property: JsonPropertyName("message")] string Message,
        [property: JsonPropertyName("date")] DateTimeOffset Date);

    private sealed record StintResponse(
        [property: JsonPropertyName("driver_number")] int DriverNumber,
        [property: JsonPropertyName("compound")] string Compound,
        [property: JsonPropertyName("lap_start")] int? LapStart,
        [property: JsonPropertyName("lap_end")] int? LapEnd,
        [property: JsonPropertyName("tyre_age_at_start")] int TyreAgeAtStart);

    private sealed record ChampionshipDriverResponse(
        [property: JsonPropertyName("driver_number")] int DriverNumber,
        [property: JsonPropertyName("position_current")] int PositionCurrent,
        [property: JsonPropertyName("points_current")] double PointsCurrent);

    private sealed record ChampionshipTeamResponse(
        [property: JsonPropertyName("team_name")] string TeamName,
        [property: JsonPropertyName("position_current")] int PositionCurrent,
        [property: JsonPropertyName("points_current")] double PointsCurrent);

    private sealed record OpenF1ErrorResponse(string? Detail);

    private async Task<T?> GetAsyncWithRetry<T>(string url, CancellationToken cancellationToken)
    {
        for (var attempt = 0; attempt <= MaxRetries; attempt++)
        {
            var response = await httpClient.GetAsync(url, cancellationToken);

            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<T>(cancellationToken: cancellationToken);
            }

            if (response.StatusCode == System.Net.HttpStatusCode.TooManyRequests && attempt < MaxRetries)
            {
                var delay = TimeSpan.FromSeconds(Math.Pow(2, attempt));
                await Task.Delay(delay, cancellationToken);
                continue;
            }

            if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return default;
            }

            if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized
                || response.StatusCode == System.Net.HttpStatusCode.TooManyRequests)
            {
                return default;
            }

            response.EnsureSuccessStatusCode();
        }

        return default;
    }

    private sealed record OpenF1SessionResponse(
        [property: JsonPropertyName("session_key")] int SessionKey,
        [property: JsonPropertyName("meeting_key")] int MeetingKey,
        [property: JsonPropertyName("year")] int Year,
        [property: JsonPropertyName("country_name")] string? CountryName,
        [property: JsonPropertyName("location")] string? Location,
        [property: JsonPropertyName("session_name")] string? SessionName,
        [property: JsonPropertyName("date_start")] DateTimeOffset? StartDate,
        [property: JsonPropertyName("date_end")] DateTimeOffset? EndDate);

    private sealed record OpenF1DriverResponse(
        [property: JsonPropertyName("driver_number")] int? DriverNumber,
        [property: JsonPropertyName("name_acronym")] string? NameAcronym,
        [property: JsonPropertyName("broadcast_name")] string? BroadcastName,
        [property: JsonPropertyName("full_name")] string? FullName,
        [property: JsonPropertyName("team_name")] string? TeamName,
        [property: JsonPropertyName("team_colour")] string? TeamColour);

    private sealed record OpenF1PositionResponse(
        [property: JsonPropertyName("driver_number")] int DriverNumber,
        [property: JsonPropertyName("position")] int Position,
        [property: JsonPropertyName("date")] DateTimeOffset Date);

    private sealed record OpenF1IntervalResponse(
        [property: JsonPropertyName("driver_number")] int DriverNumber,
        [property: JsonPropertyName("gap_to_leader")] JsonElement? GapToLeader,
        [property: JsonPropertyName("interval")] JsonElement? Interval,
        [property: JsonPropertyName("date")] DateTimeOffset Date);

    private static double? SafeParseDouble(JsonElement? element)
    {
        if (element is null) return null;
        if (element.Value.ValueKind == JsonValueKind.Null) return null;
        if (element.Value.ValueKind == JsonValueKind.Number) return element.Value.GetDouble();
        if (element.Value.ValueKind == JsonValueKind.String
            && double.TryParse(element.Value.GetString(), out var result))
        {
            return result;
        }
        return null;
    }
}

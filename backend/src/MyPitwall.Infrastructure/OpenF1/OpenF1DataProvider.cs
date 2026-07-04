using System.Net.Http.Json;
using System.Text.Json.Serialization;
using MyPitwall.Application.Abstractions;
using MyPitwall.Application.OpenF1;

namespace MyPitwall.Infrastructure.OpenF1;

public sealed class OpenF1DataProvider(HttpClient httpClient) : IF1DataProvider
{
    public async Task<IReadOnlyList<OpenF1SessionDto>> GetSessionsAsync(int year, CancellationToken cancellationToken)
    {
        var sessions = await httpClient.GetFromJsonAsync<IReadOnlyList<OpenF1SessionResponse>>(
            $"sessions?year={year}",
            cancellationToken);

        return (IReadOnlyList<OpenF1SessionDto>?)sessions?
            .Select(session => new OpenF1SessionDto(
                session.SessionKey,
                session.MeetingKey,
                session.Year,
                session.CountryName ?? "Unknown",
                session.Location ?? "Unknown",
                session.SessionName ?? "Unknown",
                session.StartDate))
            .ToList() ?? Array.Empty<OpenF1SessionDto>();
    }

    public async Task<IReadOnlyList<OpenF1DriverDto>> GetDriversAsync(int sessionKey, CancellationToken cancellationToken)
    {
        var drivers = await httpClient.GetFromJsonAsync<IReadOnlyList<OpenF1DriverResponse>>(
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

    private sealed record OpenF1SessionResponse(
        [property: JsonPropertyName("session_key")] int SessionKey,
        [property: JsonPropertyName("meeting_key")] int MeetingKey,
        [property: JsonPropertyName("year")] int Year,
        [property: JsonPropertyName("country_name")] string? CountryName,
        [property: JsonPropertyName("location")] string? Location,
        [property: JsonPropertyName("session_name")] string? SessionName,
        [property: JsonPropertyName("date_start")] DateTimeOffset? StartDate);

    private sealed record OpenF1DriverResponse(
        [property: JsonPropertyName("driver_number")] int? DriverNumber,
        [property: JsonPropertyName("name_acronym")] string? NameAcronym,
        [property: JsonPropertyName("broadcast_name")] string? BroadcastName,
        [property: JsonPropertyName("full_name")] string? FullName,
        [property: JsonPropertyName("team_name")] string? TeamName,
        [property: JsonPropertyName("team_colour")] string? TeamColour);
}

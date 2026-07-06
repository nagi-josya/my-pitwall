namespace MyPitwall.Application.OpenF1;

public sealed record OpenF1SessionDto(
    int SessionKey,
    int MeetingKey,
    int Year,
    string CountryName,
    string Location,
    string SessionName,
    DateTimeOffset? StartDate,
    DateTimeOffset? EndDate);

namespace MyPitwall.Contracts.Sessions;

public sealed record SessionSummaryResponse(
    int SessionKey,
    int MeetingKey,
    int Year,
    string CountryName,
    string Location,
    string SessionName,
    DateTimeOffset? StartDate,
    bool IsCompleted);

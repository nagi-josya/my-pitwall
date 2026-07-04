namespace MyPitwall.Contracts.Sessions;

public sealed record MeetingSummaryResponse(
    int MeetingKey,
    int Year,
    string CountryName,
    string Location,
    DateTimeOffset? StartDate);

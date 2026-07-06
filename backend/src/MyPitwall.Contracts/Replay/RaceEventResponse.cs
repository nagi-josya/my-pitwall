namespace MyPitwall.Contracts.Replay;

public sealed record RaceEventResponse(
    string Type,
    int? DriverNumber,
    string Message,
    DateTimeOffset Timestamp);

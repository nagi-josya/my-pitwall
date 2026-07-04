namespace MyPitwall.Domain.Replay;

public sealed record ReplayEvent(
    string Type,
    int? DriverNumber,
    string Message,
    TimeSpan Timestamp);

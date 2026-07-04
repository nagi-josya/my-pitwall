namespace MyPitwall.Domain.Replay;

public sealed record ReplayFrame(
    int SessionKey,
    TimeSpan SessionTime,
    int? Lap,
    IReadOnlyList<DriverReplayState> Drivers,
    IReadOnlyList<ReplayEvent> Events);

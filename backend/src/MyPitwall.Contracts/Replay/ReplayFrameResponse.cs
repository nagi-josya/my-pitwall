namespace MyPitwall.Contracts.Replay;

public sealed record ReplayFrameResponse(
    int SessionKey,
    TimeSpan SessionTime,
    int? Lap,
    IReadOnlyList<DriverFrameResponse> Drivers,
    IReadOnlyList<RaceEventResponse> Events);

using MyPitwall.Domain.Drivers;
using MyPitwall.Domain.Track;

namespace MyPitwall.Domain.Replay;

public sealed record DriverReplayState(
    Driver Driver,
    int? Position,
    string? GapToLeader,
    string? IntervalToCarAhead,
    int? CurrentLap,
    string? TyreCompound,
    int? TyreAge,
    TrackPosition? TrackPosition,
    IReadOnlyList<TrackPosition> Trail);

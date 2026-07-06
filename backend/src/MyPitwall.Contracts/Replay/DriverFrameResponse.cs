namespace MyPitwall.Contracts.Replay;

public sealed record DriverFrameResponse(
    int DriverNumber,
    string Tla,
    string FullName,
    string TeamName,
    string TeamColor,
    string? HeadshotUrl,
    int? Position,
    string? GapToLeader,
    string? IntervalToCarAhead,
    int? CurrentLap,
    string? TyreCompound,
    int? TyreAge,
    TrackPositionResponse? TrackPosition,
    IReadOnlyList<TrackPositionResponse> Trail,
    int? DebutYear,
    int? Podiums,
    int? HighestFinish,
    IReadOnlyList<int>? ChampionshipYears);

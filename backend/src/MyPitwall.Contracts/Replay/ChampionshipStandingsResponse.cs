namespace MyPitwall.Contracts.Replay;

public sealed record ChampionshipStandingsResponse(
    IReadOnlyList<ChampionshipDriverResponse> Drivers,
    IReadOnlyList<ChampionshipTeamResponse> Teams);

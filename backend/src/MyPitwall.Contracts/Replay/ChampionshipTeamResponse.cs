namespace MyPitwall.Contracts.Replay;

public sealed record ChampionshipTeamResponse(
    string TeamName,
    int Position,
    double Points);

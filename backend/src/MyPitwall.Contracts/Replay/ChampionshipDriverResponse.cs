namespace MyPitwall.Contracts.Replay;

public sealed record ChampionshipDriverResponse(
    int DriverNumber,
    string Tla,
    string FullName,
    string TeamName,
    string TeamColor,
    string HeadshotUrl,
    int Position,
    double Points);

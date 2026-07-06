namespace MyPitwall.Contracts.Replay;

public sealed record DriverCareerResponse(
    int DebutYear,
    int Podiums,
    int HighestFinish,
    IReadOnlyList<int>? ChampionshipYears);

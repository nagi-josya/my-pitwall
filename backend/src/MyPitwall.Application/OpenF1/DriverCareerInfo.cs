namespace MyPitwall.Application.OpenF1;

public sealed record DriverCareerInfo(
    int DebutYear,
    int Podiums,
    int HighestFinish,
    IReadOnlyList<int>? ChampionshipYears);

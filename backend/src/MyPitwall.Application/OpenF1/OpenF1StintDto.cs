namespace MyPitwall.Application.OpenF1;

public sealed record OpenF1StintDto(
    int DriverNumber,
    string Compound,
    int? LapStart,
    int? LapEnd,
    int TyreAgeAtStart);

namespace MyPitwall.Application.OpenF1;

public sealed record OpenF1DriverDto(
    int DriverNumber,
    string Tla,
    string FullName,
    string TeamName,
    string TeamColor);

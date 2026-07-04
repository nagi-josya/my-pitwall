namespace MyPitwall.Domain.Drivers;

public sealed record Driver(
    int DriverNumber,
    string Tla,
    string FullName,
    string TeamName,
    string TeamColor);

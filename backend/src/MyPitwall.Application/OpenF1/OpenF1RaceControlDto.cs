namespace MyPitwall.Application.OpenF1;

public sealed record OpenF1RaceControlDto(
    int? DriverNumber,
    string Category,
    string Message,
    DateTimeOffset Date);

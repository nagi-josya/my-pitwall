namespace MyPitwall.Application.OpenF1;

public sealed record OpenF1PositionDto(
    int DriverNumber,
    int Position,
    DateTimeOffset Date);

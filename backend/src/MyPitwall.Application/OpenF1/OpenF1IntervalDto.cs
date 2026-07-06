namespace MyPitwall.Application.OpenF1;

public sealed record OpenF1IntervalDto(
    int DriverNumber,
    double? GapToLeader,
    double? Interval,
    DateTimeOffset Date);

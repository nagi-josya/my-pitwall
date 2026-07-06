using MyPitwall.Application.Abstractions;
using MyPitwall.Contracts.Replay;

namespace MyPitwall.Application.Replay;

public sealed class ReplayFrameFactory(IF1DataProvider dataProvider)
{
    public async Task<ReplayFrameResponse> CreateOpeningFrameAsync(int sessionKey, CancellationToken cancellationToken)
    {
        var driversTask = dataProvider.GetDriversAsync(sessionKey, cancellationToken);
        var positionsTask = dataProvider.GetPositionsAsync(sessionKey, cancellationToken);
        var intervalsTask = dataProvider.GetIntervalsAsync(sessionKey, cancellationToken);
        var stintsTask = dataProvider.GetStintsAsync(sessionKey, cancellationToken);
        var eventsTask = dataProvider.GetRaceControlEventsAsync(sessionKey, cancellationToken);

        await Task.WhenAll(driversTask, positionsTask, intervalsTask, stintsTask, eventsTask);

        var drivers = driversTask.Result;
        var positions = positionsTask.Result;
        var intervals = intervalsTask.Result;
        var stints = stintsTask.Result;
        var raceControlEvents = eventsTask.Result;

        var latestPositionByDriver = positions
            .GroupBy(p => p.DriverNumber)
            .ToDictionary(
                g => g.Key,
                g => g.MaxBy(p => p.Date)!.Position);

        var latestIntervalByDriver = intervals
            .GroupBy(i => i.DriverNumber)
            .ToDictionary(
                g => g.Key,
                g => g.MaxBy(i => i.Date));

        var latestStintByDriver = stints
            .GroupBy(s => s.DriverNumber)
            .ToDictionary(
                g => g.Key,
                g => g.MaxBy(s => s.LapEnd));

        var driverFrames = drivers
            .Select(driver =>
            {
                var pos = latestPositionByDriver.GetValueOrDefault(driver.DriverNumber);
                var interval = latestIntervalByDriver.GetValueOrDefault(driver.DriverNumber);
                var stint = latestStintByDriver.GetValueOrDefault(driver.DriverNumber);

                return new
                {
                    Driver = driver,
                    Position = pos,
                    Interval = interval,
                    Stint = stint
                };
            })
            .OrderBy(x => x.Position)
            .ThenBy(x => x.Driver.DriverNumber)
            .Select((x, index) =>
            {
                var position = x.Position;
                var gapToLeader = position == 1 ? "Leader" : FormatGap(x.Interval?.GapToLeader);
                var intervalToCarAhead = position == 1 ? null : FormatGap(x.Interval?.Interval);

                if (gapToLeader is null && intervalToCarAhead is null && position != 1)
                {
                    gapToLeader = "DNF";
                }

                var normalizedColor = NormalizeTeamColor(x.Driver.TeamColor);

                var currentLap = x.Stint?.LapEnd;
                var tyreCompound = x.Stint?.Compound;
                var tyreAge = x.Stint is not null && x.Stint.LapEnd.HasValue && x.Stint.LapStart.HasValue
                    ? (int?)(x.Stint.LapEnd.Value - x.Stint.LapStart.Value + 1)
                    : null;

                return new DriverFrameResponse(
                    x.Driver.DriverNumber,
                    x.Driver.Tla,
                    x.Driver.FullName,
                    x.Driver.TeamName,
                    normalizedColor,
                    HeadshotMapping.GetHeadshotUrl(x.Driver.DriverNumber, x.Driver.FullName, normalizedColor),
                    position,
                    gapToLeader,
                    intervalToCarAhead,
                    currentLap,
                    tyreCompound,
                    tyreAge,
                    null,
                    Array.Empty<TrackPositionResponse>(),
                    null,
                    null,
                    null,
                    null);
            })
            .ToList();

        var totalLaps = driverFrames
            .MaxBy(d => d.CurrentLap)
            ?.CurrentLap;

        var events = raceControlEvents
            .Select(e => new RaceEventResponse(
                e.Category,
                e.DriverNumber,
                e.Message,
                e.Date))
            .ToList();

        return new ReplayFrameResponse(
            sessionKey,
            TimeSpan.Zero,
            totalLaps,
            driverFrames,
            events);
    }

    private static string? FormatGap(double? seconds)
    {
        if (seconds is null) return null;

        if (seconds.Value >= 0)
        {
            return $"+{seconds.Value:F1}s";
        }

        return $"{seconds.Value:F1}s";
    }

    private static string NormalizeTeamColor(string teamColor)
    {
        if (string.IsNullOrWhiteSpace(teamColor))
        {
            return "#FFFFFF";
        }

        return teamColor.StartsWith('#') ? teamColor : $"#{teamColor}";
    }
}

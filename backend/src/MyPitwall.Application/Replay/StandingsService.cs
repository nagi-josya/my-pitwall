using MyPitwall.Application.Abstractions;
using MyPitwall.Contracts.Replay;

namespace MyPitwall.Application.Replay;

public sealed class StandingsService(IF1DataProvider dataProvider)
{
    public async Task<ChampionshipStandingsResponse> GetStandingsAsync(int sessionKey, CancellationToken cancellationToken)
    {
        var driversTask = dataProvider.GetDriversAsync(sessionKey, cancellationToken);
        var champDriversTask = dataProvider.GetChampionshipDriversAsync(sessionKey, cancellationToken);
        var champTeamsTask = dataProvider.GetChampionshipTeamsAsync(sessionKey, cancellationToken);

        await Task.WhenAll(driversTask, champDriversTask, champTeamsTask);

        var drivers = driversTask.Result;
        var champDrivers = champDriversTask.Result;
        var champTeams = champTeamsTask.Result;

        var driverLookup = drivers.ToDictionary(d => d.DriverNumber);

        var driverStandings = champDrivers
            .Select(cd =>
            {
                var driver = driverLookup.GetValueOrDefault(cd.DriverNumber);
                var normalizedColor = NormalizeTeamColor(driver?.TeamColor);
                return new ChampionshipDriverResponse(
                    cd.DriverNumber,
                    driver?.Tla ?? cd.DriverNumber.ToString(),
                    driver?.FullName ?? "Unknown Driver",
                    driver?.TeamName ?? "Unknown Team",
                    normalizedColor,
                    HeadshotMapping.GetHeadshotUrl(cd.DriverNumber, driver?.FullName ?? "Unknown", normalizedColor),
                    cd.PositionCurrent,
                    cd.PointsCurrent);
            })
            .OrderBy(d => d.Position)
            .ToList();

        var teamStandings = champTeams
            .Select(ct => new ChampionshipTeamResponse(
                ct.TeamName,
                ct.PositionCurrent,
                ct.PointsCurrent))
            .OrderBy(t => t.Position)
            .ToList();

        return new ChampionshipStandingsResponse(driverStandings, teamStandings);
    }

    private static string NormalizeTeamColor(string? teamColor)
    {
        if (string.IsNullOrWhiteSpace(teamColor))
            return "#FFFFFF";

        return teamColor.StartsWith('#') ? teamColor : $"#{teamColor}";
    }
}

using MyPitwall.Application.Abstractions;
using MyPitwall.Contracts.Replay;

namespace MyPitwall.Application.Replay;

public sealed class ReplayFrameFactory(IF1DataProvider dataProvider)
{
    public async Task<ReplayFrameResponse> CreateOpeningFrameAsync(int sessionKey, CancellationToken cancellationToken)
    {
        var drivers = await dataProvider.GetDriversAsync(sessionKey, cancellationToken);

        var driverFrames = drivers
            .OrderBy(driver => driver.DriverNumber)
            .Select((driver, index) => new DriverFrameResponse(
                driver.DriverNumber,
                driver.Tla,
                driver.FullName,
                driver.TeamName,
                NormalizeTeamColor(driver.TeamColor),
                index + 1,
                index == 0 ? "Leader" : null,
                null,
                null,
                null,
                null,
                null,
                Array.Empty<TrackPositionResponse>()))
            .ToList();

        return new ReplayFrameResponse(
            sessionKey,
            TimeSpan.Zero,
            null,
            driverFrames,
            Array.Empty<RaceEventResponse>());
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

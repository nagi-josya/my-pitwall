using MyPitwall.Application.OpenF1;

namespace MyPitwall.Application.Abstractions;

public interface IF1DataProvider
{
    Task<IReadOnlyList<OpenF1SessionDto>> GetSessionsAsync(int year, int? meetingKey = null, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<OpenF1DriverDto>> GetDriversAsync(int sessionKey, CancellationToken cancellationToken);

    Task<IReadOnlyList<OpenF1PositionDto>> GetPositionsAsync(int sessionKey, CancellationToken cancellationToken);

    Task<IReadOnlyList<OpenF1IntervalDto>> GetIntervalsAsync(int sessionKey, CancellationToken cancellationToken);

    Task<IReadOnlyList<ChampionshipDriverDto>> GetChampionshipDriversAsync(int sessionKey, CancellationToken cancellationToken);

    Task<IReadOnlyList<ChampionshipTeamDto>> GetChampionshipTeamsAsync(int sessionKey, CancellationToken cancellationToken);

    Task<IReadOnlyList<OpenF1StintDto>> GetStintsAsync(int sessionKey, CancellationToken cancellationToken);

    Task<IReadOnlyList<OpenF1RaceControlDto>> GetRaceControlEventsAsync(int sessionKey, CancellationToken cancellationToken);

    Task<string?> CheckAvailabilityAsync(CancellationToken cancellationToken = default);
}

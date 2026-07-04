using MyPitwall.Application.OpenF1;

namespace MyPitwall.Application.Abstractions;

public interface IF1DataProvider
{
    Task<IReadOnlyList<OpenF1SessionDto>> GetSessionsAsync(int year, int? meetingKey = null, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<OpenF1DriverDto>> GetDriversAsync(int sessionKey, CancellationToken cancellationToken);
}

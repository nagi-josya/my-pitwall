using MyPitwall.Application.OpenF1;

namespace MyPitwall.Application.Abstractions;

public interface IF1DataProvider
{
    Task<IReadOnlyList<OpenF1SessionDto>> GetSessionsAsync(int year, CancellationToken cancellationToken);

    Task<IReadOnlyList<OpenF1DriverDto>> GetDriversAsync(int sessionKey, CancellationToken cancellationToken);
}

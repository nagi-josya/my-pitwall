using MyPitwall.Application.OpenF1;

namespace MyPitwall.Application.Abstractions;

public interface IDriverCareerProvider
{
    Task<DriverCareerInfo?> GetCareerAsync(string fullName, CancellationToken cancellationToken = default);
}

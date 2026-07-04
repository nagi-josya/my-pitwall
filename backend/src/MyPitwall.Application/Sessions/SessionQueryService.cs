using MyPitwall.Application.Abstractions;
using MyPitwall.Contracts.Sessions;

namespace MyPitwall.Application.Sessions;

public sealed class SessionQueryService(IF1DataProvider dataProvider)
{
    public async Task<IReadOnlyList<SessionSummaryResponse>> GetSessionsAsync(int year, int? meetingKey = null, CancellationToken cancellationToken = default)
    {
        var sessions = await dataProvider.GetSessionsAsync(year, meetingKey, cancellationToken);

        return sessions
            .OrderBy(session => session.StartDate)
            .Select(session => new SessionSummaryResponse(
                session.SessionKey,
                session.MeetingKey,
                session.Year,
                session.CountryName,
                session.Location,
                session.SessionName,
                session.StartDate))
            .ToList();
    }
}

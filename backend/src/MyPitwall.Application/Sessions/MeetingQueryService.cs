using MyPitwall.Application.Abstractions;
using MyPitwall.Contracts.Sessions;

namespace MyPitwall.Application.Sessions;

public sealed class MeetingQueryService(IF1DataProvider dataProvider)
{
    public async Task<IReadOnlyList<MeetingSummaryResponse>> GetMeetingsAsync(int year, CancellationToken cancellationToken)
    {
        var sessions = await dataProvider.GetSessionsAsync(year, cancellationToken: cancellationToken);

        return sessions
            .GroupBy(session => session.MeetingKey)
            .Select(group =>
            {
                var first = group.First();
                return new MeetingSummaryResponse(
                    group.Key,
                    year,
                    first.CountryName,
                    first.Location,
                    group.Min(s => s.StartDate));
            })
            .OrderBy(meeting => meeting.StartDate)
            .ToList();
    }
}

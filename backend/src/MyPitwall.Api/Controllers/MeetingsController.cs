using Microsoft.AspNetCore.Mvc;
using MyPitwall.Application.Sessions;
using MyPitwall.Contracts.Sessions;

namespace MyPitwall.Api.Controllers;

[ApiController]
[Route("api/meetings")]
public sealed class MeetingsController(MeetingQueryService meetingQueryService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<MeetingSummaryResponse>>> GetMeetings(
        [FromQuery] int year = 2024,
        CancellationToken cancellationToken = default)
    {
        var meetings = await meetingQueryService.GetMeetingsAsync(year, cancellationToken);

        return Ok(meetings);
    }
}

using Microsoft.AspNetCore.Mvc;
using MyPitwall.Application.Sessions;
using MyPitwall.Contracts.Sessions;

namespace MyPitwall.Api.Controllers;

[ApiController]
[Route("api/sessions")]
public sealed class SessionsController(SessionQueryService sessionQueryService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<SessionSummaryResponse>>> GetSessions(
        [FromQuery] int year = 2024,
        CancellationToken cancellationToken = default)
    {
        var sessions = await sessionQueryService.GetSessionsAsync(year, cancellationToken);

        return Ok(sessions);
    }
}

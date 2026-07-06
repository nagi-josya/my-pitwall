using Microsoft.AspNetCore.Mvc;
using MyPitwall.Application.Replay;
using MyPitwall.Contracts.Replay;

namespace MyPitwall.Api.Controllers;

[ApiController]
[Route("api/standings")]
public sealed class StandingsController(StandingsService standingsService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ChampionshipStandingsResponse>> GetStandings(
        [FromQuery] int sessionKey,
        CancellationToken cancellationToken)
    {
        var standings = await standingsService.GetStandingsAsync(sessionKey, cancellationToken);

        return Ok(standings);
    }
}

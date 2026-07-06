using Microsoft.AspNetCore.Mvc;
using MyPitwall.Application.Abstractions;
using MyPitwall.Application.Replay;
using MyPitwall.Contracts.Replay;

namespace MyPitwall.Api.Controllers;

[ApiController]
[Route("api/replays")]
public sealed class ReplaysController(
    ReplayFrameFactory replayFrameFactory,
    IF1DataProvider dataProvider,
    IDriverCareerProvider careerProvider) : ControllerBase
{
    [HttpPost("preview")]
    public async Task<ActionResult<ReplayFrameResponse>> Preview(
        StartReplayRequest request,
        CancellationToken cancellationToken)
    {
        var frame = await replayFrameFactory.CreateOpeningFrameAsync(request.SessionKey, cancellationToken);

        return Ok(frame);
    }

    [HttpGet("{sessionKey}/drivers/{driverNumber}/career")]
    public async Task<ActionResult<DriverCareerResponse?>> GetDriverCareer(
        int sessionKey,
        int driverNumber,
        CancellationToken cancellationToken)
    {
        var drivers = await dataProvider.GetDriversAsync(sessionKey, cancellationToken);
        var driver = drivers.FirstOrDefault(d => d.DriverNumber == driverNumber);

        if (driver is null)
            return NotFound();

        var career = await careerProvider.GetCareerAsync(driver.FullName, cancellationToken);

        if (career is null)
            return Ok(null);

        return Ok(new DriverCareerResponse(
            career.DebutYear,
            career.Podiums,
            career.HighestFinish,
            career.ChampionshipYears));
    }
}

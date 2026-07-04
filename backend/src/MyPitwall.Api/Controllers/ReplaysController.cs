using Microsoft.AspNetCore.Mvc;
using MyPitwall.Application.Replay;
using MyPitwall.Contracts.Replay;

namespace MyPitwall.Api.Controllers;

[ApiController]
[Route("api/replays")]
public sealed class ReplaysController(ReplayFrameFactory replayFrameFactory) : ControllerBase
{
    [HttpPost("preview")]
    public async Task<ActionResult<ReplayFrameResponse>> Preview(
        StartReplayRequest request,
        CancellationToken cancellationToken)
    {
        var frame = await replayFrameFactory.CreateOpeningFrameAsync(request.SessionKey, cancellationToken);

        return Ok(frame);
    }
}

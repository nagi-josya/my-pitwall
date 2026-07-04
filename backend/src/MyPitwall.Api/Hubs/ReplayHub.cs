using Microsoft.AspNetCore.SignalR;
using MyPitwall.Application.Replay;
using MyPitwall.Contracts.Replay;

namespace MyPitwall.Api.Hubs;

public sealed class ReplayHub(ReplayFrameFactory replayFrameFactory) : Hub
{
    public async Task StartReplay(StartReplayRequest request, CancellationToken cancellationToken)
    {
        var frame = await replayFrameFactory.CreateOpeningFrameAsync(request.SessionKey, cancellationToken);

        await Clients.Caller.SendAsync("ReplayFrameUpdated", frame, cancellationToken);
    }
}

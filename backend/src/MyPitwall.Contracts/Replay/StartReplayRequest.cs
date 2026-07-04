namespace MyPitwall.Contracts.Replay;

public sealed record StartReplayRequest(
    int SessionKey,
    double Speed = 1.0,
    int? FollowDriverNumber = null);

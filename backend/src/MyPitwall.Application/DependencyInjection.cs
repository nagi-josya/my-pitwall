using Microsoft.Extensions.DependencyInjection;
using MyPitwall.Application.Replay;
using MyPitwall.Application.Sessions;

namespace MyPitwall.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<ReplayFrameFactory>();
        services.AddScoped<SessionQueryService>();

        return services;
    }
}

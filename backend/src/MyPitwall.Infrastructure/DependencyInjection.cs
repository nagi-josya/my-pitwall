using Microsoft.Extensions.DependencyInjection;
using MyPitwall.Application.Abstractions;
using MyPitwall.Infrastructure.OpenF1;

namespace MyPitwall.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddHttpClient<IF1DataProvider, OpenF1DataProvider>(client =>
        {
            client.BaseAddress = new Uri("https://api.openf1.org/v1/");
            client.Timeout = TimeSpan.FromSeconds(30);
        });

        return services;
    }
}

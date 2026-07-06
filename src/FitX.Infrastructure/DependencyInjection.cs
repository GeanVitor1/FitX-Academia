using FitX.Infrastructure.Interfaces;
using FitX.Infrastructure.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FitX.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var redisConnection = configuration.GetConnectionString("Redis") ?? "localhost:6379";
        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = redisConnection;
            options.InstanceName = "FitX_";
        });

        services.AddScoped<ICacheService, RedisCacheService>();
        services.AddScoped<IQRCodeService, QRCodeService>();
        services.AddScoped<IExportService, ExportService>();

        return services;
    }
}

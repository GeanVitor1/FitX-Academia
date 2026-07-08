using FitX.Infrastructure.Interfaces;
using FitX.Infrastructure.Services;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Minio;

namespace FitX.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var redisConnection = configuration.GetConnectionString("Redis");
        if (!string.IsNullOrEmpty(redisConnection))
        {
            services.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = redisConnection;
                options.InstanceName = "FitX_";
            });
        }
        else
        {
            services.AddDistributedMemoryCache();
        }

        services.AddScoped<ICacheService, RedisCacheService>();
        services.AddScoped<IQRCodeService, QRCodeService>();
        services.AddScoped<IExportService, ExportService>();

        var minioEndpoint = configuration["Minio:Endpoint"];
        if (!string.IsNullOrEmpty(minioEndpoint))
        {
            services.AddScoped<IMinioClient>(_ =>
                new MinioClient()
                    .WithEndpoint(minioEndpoint)
                    .WithCredentials(
                        configuration["Minio:AccessKey"] ?? "minioadmin",
                        configuration["Minio:SecretKey"] ?? "minioadmin")
                    .WithSSL(bool.TryParse(configuration["Minio:UseSSL"], out var useSsl) && useSsl)
                    .Build());
            services.AddScoped<IStorageService, MinioStorageService>();
        }

        services.AddScoped<IAuditService, AuditService>();

        return services;
    }
}

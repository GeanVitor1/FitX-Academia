using System.Text;
using FitX.Domain.Entities;
using FitX.Domain.Enums;
using FitX.Identity.Models;
using FitX.Identity.Services;
using FitX.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace FitX.Identity;

public static class DependencyInjection
{
    public static IServiceCollection AddIdentity(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<JwtSettings>(configuration.GetSection(JwtSettings.SectionName));

        services.AddIdentity<Usuario, IdentityRole<Guid>>(options =>
        {
            options.Password.RequireDigit = false;
            options.Password.RequireLowercase = false;
            options.Password.RequireUppercase = false;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequiredLength = 4;
            options.User.RequireUniqueEmail = true;
            options.SignIn.RequireConfirmedEmail = false;
            options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
            options.Lockout.MaxFailedAccessAttempts = 5;
            options.Lockout.AllowedForNewUsers = true;
        })
        .AddEntityFrameworkStores<FitXDbContext>()
        .AddDefaultTokenProviders();

        var jwtSettings = new JwtSettings();
        configuration.GetSection(JwtSettings.SectionName).Bind(jwtSettings);

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtSettings.Issuer,
                ValidAudience = jwtSettings.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secret)),
                ClockSkew = TimeSpan.Zero
            };

            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    var accessToken = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
                    var path = context.HttpContext.Request.Path;

                    if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                    {
                        context.Token = accessToken;
                    }

                    return Task.CompletedTask;
                }
            };
        });

        services.AddAuthorization(options =>
        {
            options.AddPolicy("Admin", policy => policy.RequireRole(UserRole.Admin.ToString()));
            options.AddPolicy("Professor", policy => policy.RequireRole(UserRole.Professor.ToString()));
            options.AddPolicy("Aluno", policy => policy.RequireRole(UserRole.Aluno.ToString()));
            options.AddPolicy("Recepcionista", policy => policy.RequireRole(UserRole.Recepcionista.ToString()));
            options.AddPolicy("Financeiro", policy => policy.RequireRole(UserRole.Financeiro.ToString()));
            options.AddPolicy("Staff", policy => policy.RequireRole(
                UserRole.Admin.ToString(),
                UserRole.Professor.ToString(),
                UserRole.Recepcionista.ToString(),
                UserRole.Financeiro.ToString()));
        });

        services.AddScoped<TokenService>();
        services.AddScoped<AuthService>();

        return services;
    }
}

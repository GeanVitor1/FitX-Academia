using System.Text.Json.Serialization;
using FitX.API.Middlewares;
using FitX.Domain.Entities;
using FitX.Domain.Enums;
using FluentValidation.AspNetCore;
using FitX.Application;
using FitX.Identity;
using FitX.Infrastructure;
using FitX.Infrastructure.Hubs;
using FitX.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Configuration
// Persistence
builder.Services.AddPersistence(builder.Configuration);

// Identity & Authentication
builder.Services.AddIdentity(builder.Configuration);

// Application Services
builder.Services.AddApplication();

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});

builder.Services.AddFluentValidationAutoValidation();

// Infrastructure
builder.Services.AddInfrastructure(builder.Configuration);

// SignalR
builder.Services.AddSignalR();

// Controllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.SetIsOriginAllowed(origin => Uri.TryCreate(origin, UriKind.Absolute, out var uri) && uri.Host == "localhost")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "FitX API",
        Version = "v1",
        Description = "API do sistema FitX - Smart Gym Management"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Insira o token JWT"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Middleware
app.UseMiddleware<ExceptionMiddleware>();
app.UseMiddleware<RequestLoggingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "FitX API v1");
    });
}

app.UseCors("AllowAngular");

app.UseAuthentication();
app.UseAuthorization();

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.MapControllers();
app.MapHub<NotificationHub>("/hubs/notifications");

// Apply pending migrations
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<FitX.Persistence.FitXDbContext>();
    try
    {
        await db.Database.MigrateAsync();
    }
    catch
    {
        await db.Database.ExecuteSqlRawAsync(@"
            CREATE TABLE IF NOT EXISTS Equipamentos (
                Id TEXT PRIMARY KEY,
                Nome TEXT NOT NULL,
                Categoria TEXT NOT NULL,
                Localizacao TEXT,
                Status INTEGER NOT NULL,
                UltimaManutencao TEXT,
                CriadoEm TEXT NOT NULL,
                AtualizadoEm TEXT,
                Ativo INTEGER NOT NULL
            );
            CREATE INDEX IF NOT EXISTS IX_Equipamentos_Categoria ON Equipamentos(Categoria);
            CREATE INDEX IF NOT EXISTS IX_Equipamentos_Nome ON Equipamentos(Nome);
            CREATE INDEX IF NOT EXISTS IX_Equipamentos_Status ON Equipamentos(Status);
        ");
    }
}

// Auto-seed demo users on startup (only if they don't exist)
using (var scope = app.Services.CreateScope())
{
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<Usuario>>();
    var dbContext = scope.ServiceProvider.GetRequiredService<FitX.Persistence.FitXDbContext>();

    var demoLogins = new (string email, string nome, UserRole role, string password)[]
    {
        ("admin@fitx.com",      "Admin FitX",         UserRole.Admin,         "1234"),
        ("prof@fitx.com",       "Professor FitX",     UserRole.Professor,     "1234"),
        ("aluno@fitx.com",      "Aluno FitX",         UserRole.Aluno,         "1234"),
        ("recepcao@fitx.com",   "Maria Recepcao",     UserRole.Recepcionista, "1234"),
        ("financeiro@fitx.com", "Pedro Financeiro",   UserRole.Financeiro,    "1234")
    };

    foreach (var (email, nome, role, password) in demoLogins)
    {
        var existing = await userManager.FindByEmailAsync(email);
        if (existing is not null) continue;

        var user = new Usuario
        {
            UserName = email,
            Nome = nome,
            Email = email,
            Role = role,
            Ativo = true,
            CriadoEm = DateTime.UtcNow
        };
        await userManager.CreateAsync(user, password);

        if (role == UserRole.Professor && !dbContext.Professores.Any(p => p.UsuarioId == user.Id))
        {
            dbContext.Professores.Add(new FitX.Domain.Entities.Professor
            {
                UsuarioId = user.Id,
                Especialidade = "Geral"
            });
        }
        else if (role == UserRole.Aluno && !dbContext.Alunos.Any(a => a.UsuarioId == user.Id))
        {
            dbContext.Alunos.Add(new FitX.Domain.Entities.Aluno
            {
                UsuarioId = user.Id,
                DataMatricula = DateTime.UtcNow
            });
        }

        await dbContext.SaveChangesAsync();
    }
}

app.Run();

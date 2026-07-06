using FitX.Domain.Interfaces;
using FitX.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FitX.Persistence;

public static class DependencyInjection
{
    public static IServiceCollection AddPersistence(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        services.AddDbContext<FitXDbContext>(options =>
            options.UseSqlite(connectionString, b =>
            {
                b.MigrationsAssembly(typeof(FitXDbContext).Assembly.FullName);
            }));

        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IUsuarioRepository, UsuarioRepository>();
        services.AddScoped<IAlunoRepository, AlunoRepository>();
        services.AddScoped<IProfessorRepository, ProfessorRepository>();
        services.AddScoped<ITreinoRepository, TreinoRepository>();
        services.AddScoped<ICheckinRepository, CheckinRepository>();
        services.AddScoped<IMensalidadeRepository, MensalidadeRepository>();
        services.AddScoped<IAulaRepository, AulaRepository>();
        services.AddScoped<IAvaliacaoRepository, AvaliacaoRepository>();
        services.AddScoped<IPagamentoRepository, PagamentoRepository>();
        services.AddScoped<IAgendamentoRepository, AgendamentoRepository>();
        services.AddScoped<INotificacaoRepository, NotificacaoRepository>();

        return services;
    }
}

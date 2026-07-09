using FitX.Application.Services;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace FitX.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);

        services.AddScoped<UsuarioService>();
        services.AddScoped<AlunoService>();
        services.AddScoped<ProfessorService>();
        services.AddScoped<PlanoService>();
        services.AddScoped<TreinoService>();
        services.AddScoped<CheckinService>();
        services.AddScoped<MensalidadeService>();
        services.AddScoped<AvaliacaoService>();
        services.AddScoped<PagamentoService>();
        services.AddScoped<AulaService>();
        services.AddScoped<AgendamentoService>();
        services.AddScoped<NotificacaoService>();
        services.AddScoped<DashboardService>();
        services.AddScoped<EquipamentoService>();
        services.AddScoped<RelatorioService>();
        services.AddScoped<ExercicioService>();

        return services;
    }
}

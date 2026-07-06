namespace FitX.Infrastructure.Interfaces;

public interface IAuditService
{
    Task LogAsync(Guid? usuarioId, string tipo, string acao, string? entidade = null, string? entidadeId = null, string? detalhes = null, string? ip = null);
}

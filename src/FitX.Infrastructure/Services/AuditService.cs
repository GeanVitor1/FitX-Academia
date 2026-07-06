using FitX.Domain.Entities;
using FitX.Domain.Interfaces;
using FitX.Infrastructure.Interfaces;

namespace FitX.Infrastructure.Services;

public class AuditService : IAuditService
{
    private readonly IRepository<Log> _logRepository;
    private readonly IUnitOfWork _unitOfWork;

    public AuditService(IRepository<Log> logRepository, IUnitOfWork unitOfWork)
    {
        _logRepository = logRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task LogAsync(Guid? usuarioId, string tipo, string acao, string? entidade = null, string? entidadeId = null, string? detalhes = null, string? ip = null)
    {
        var log = new Log
        {
            UsuarioId = usuarioId,
            Tipo = Enum.Parse<FitX.Domain.Enums.TipoLog>(tipo),
            Acao = acao,
            Entidade = entidade,
            EntidadeId = entidadeId,
            Detalhes = detalhes,
            Ip = ip
        };

        await _logRepository.AddAsync(log);
        await _unitOfWork.SaveChangesAsync();
    }
}

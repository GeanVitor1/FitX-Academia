using FitX.Domain.Entities;
using FitX.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FitX.Persistence.Repositories;

public class NotificacaoRepository : Repository<Notificacao>, INotificacaoRepository
{
    public NotificacaoRepository(FitXDbContext context) : base(context) { }

    public async Task<IEnumerable<Notificacao>> GetByUsuarioIdAsync(Guid usuarioId)
    {
        return await _dbSet
            .Where(n => n.UsuarioId == usuarioId && n.Ativo)
            .OrderByDescending(n => n.CriadoEm)
            .ToListAsync();
    }

    public async Task<IEnumerable<Notificacao>> GetNaoLidasAsync(Guid usuarioId)
    {
        return await _dbSet
            .Where(n => n.UsuarioId == usuarioId && !n.Lida && n.Ativo)
            .OrderByDescending(n => n.CriadoEm)
            .ToListAsync();
    }

    public async Task<int> CountNaoLidasAsync(Guid usuarioId)
    {
        return await _dbSet.CountAsync(n => n.UsuarioId == usuarioId && !n.Lida && n.Ativo);
    }
}

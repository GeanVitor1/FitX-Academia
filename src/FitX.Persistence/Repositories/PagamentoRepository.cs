using FitX.Domain.Entities;
using FitX.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FitX.Persistence.Repositories;

public class PagamentoRepository : Repository<Pagamento>, IPagamentoRepository
{
    public PagamentoRepository(FitXDbContext context) : base(context) { }

    public async Task<IEnumerable<Pagamento>> GetByMensalidadeIdAsync(Guid mensalidadeId)
    {
        return await _dbSet
            .Include(p => p.Mensalidade)
            .Where(p => p.MensalidadeId == mensalidadeId && p.Ativo)
            .OrderByDescending(p => p.Data)
            .ToListAsync();
    }

    public async Task<IEnumerable<Pagamento>> GetAllWithDetailsAsync()
    {
        return await _dbSet
            .Include(p => p.Mensalidade).ThenInclude(m => m.Aluno).ThenInclude(a => a.Usuario)
            .Include(p => p.Mensalidade).ThenInclude(m => m.Plano)
            .Where(p => p.Ativo)
            .OrderByDescending(p => p.Data)
            .ToListAsync();
    }

    public async Task<Pagamento?> GetDetailedByIdAsync(Guid id)
    {
        return await _dbSet
            .Include(p => p.Mensalidade).ThenInclude(m => m.Aluno).ThenInclude(a => a.Usuario)
            .Include(p => p.Mensalidade).ThenInclude(m => m.Plano)
            .FirstOrDefaultAsync(p => p.Id == id);
    }
}

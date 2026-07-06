using FitX.Domain.Entities;
using FitX.Domain.Enums;
using FitX.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FitX.Persistence.Repositories;

public class MensalidadeRepository : Repository<Mensalidade>, IMensalidadeRepository
{
    public MensalidadeRepository(FitXDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Mensalidade>> GetByAlunoIdAsync(Guid alunoId)
    {
        return await _dbSet
            .Include(m => m.Plano)
            .Include(m => m.Pagamentos)
            .Where(m => m.AlunoId == alunoId)
            .OrderByDescending(m => m.DataVencimento)
            .ToListAsync();
    }

    public async Task<IEnumerable<Mensalidade>> GetByStatusAsync(StatusMensalidade status)
    {
        return await _dbSet
            .Include(m => m.Aluno)
                .ThenInclude(a => a.Usuario)
            .Include(m => m.Plano)
            .Where(m => m.Status == status)
            .ToListAsync();
    }

    public async Task<Mensalidade?> GetWithPagamentosAsync(Guid id)
    {
        return await _dbSet
            .Include(m => m.Aluno)
                .ThenInclude(a => a.Usuario)
            .Include(m => m.Plano)
            .Include(m => m.Pagamentos)
            .FirstOrDefaultAsync(m => m.Id == id);
    }
}

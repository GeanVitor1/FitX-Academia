using FitX.Domain.Entities;
using FitX.Domain.Enums;
using FitX.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FitX.Persistence.Repositories;

public class CheckinRequestRepository : Repository<CheckinRequest>, ICheckinRequestRepository
{
    public CheckinRequestRepository(FitXDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<CheckinRequest>> GetPendingAsync()
    {
        return await _dbSet
            .Include(r => r.Aluno)
                .ThenInclude(a => a.Usuario)
            .Where(r => r.Status == StatusCheckinRequest.Pendente && r.Ativo)
            .OrderByDescending(r => r.CriadoEm)
            .ToListAsync();
    }

    public async Task<IEnumerable<CheckinRequest>> GetByAlunoIdAsync(Guid alunoId)
    {
        return await _dbSet
            .Include(r => r.RespondidaPor)
            .Where(r => r.AlunoId == alunoId)
            .OrderByDescending(r => r.CriadoEm)
            .ToListAsync();
    }

    public async Task<CheckinRequest?> GetActiveRequestAsync(Guid alunoId)
    {
        return await _dbSet
            .FirstOrDefaultAsync(r => r.AlunoId == alunoId && r.Status == StatusCheckinRequest.Pendente && r.Ativo);
    }
}

using FitX.Domain.Entities;
using FitX.Domain.Enums;
using FitX.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FitX.Persistence.Repositories;

public class CheckinRepository : Repository<Checkin>, ICheckinRepository
{
    public CheckinRepository(FitXDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Checkin>> GetByAlunoIdAsync(Guid alunoId)
    {
        return await _dbSet
            .Where(c => c.AlunoId == alunoId)
            .OrderByDescending(c => c.DataEntrada)
            .ToListAsync();
    }

    public async Task<Checkin?> GetActiveCheckinAsync(Guid alunoId)
    {
        return await _dbSet
            .FirstOrDefaultAsync(c => c.AlunoId == alunoId && c.Status == StatusCheckin.Presente);
    }

    public async Task<IEnumerable<Checkin>> GetActiveCheckinsAsync()
    {
        return await _dbSet
            .Include(c => c.Aluno)
                .ThenInclude(a => a.Usuario)
            .Where(c => c.Status == StatusCheckin.Presente)
            .ToListAsync();
    }
}

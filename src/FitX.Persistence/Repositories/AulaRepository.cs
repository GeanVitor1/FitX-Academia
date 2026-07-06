using FitX.Domain.Entities;
using FitX.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FitX.Persistence.Repositories;

public class AulaRepository : Repository<Aula>, IAulaRepository
{
    public AulaRepository(FitXDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Aula>> GetAllWithProfessorAsync()
    {
        return await _dbSet
            .Include(a => a.Professor)
                .ThenInclude(p => p.Usuario)
            .Where(a => a.Ativa)
            .ToListAsync();
    }

    public async Task<Aula?> GetDetailedByIdAsync(Guid id)
    {
        return await _dbSet
            .Include(a => a.Professor)
                .ThenInclude(p => p.Usuario)
            .Include(a => a.Agendamentos)
                .ThenInclude(ag => ag.Aluno)
                    .ThenInclude(al => al.Usuario)
            .FirstOrDefaultAsync(a => a.Id == id);
    }
}

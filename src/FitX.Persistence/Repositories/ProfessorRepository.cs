using FitX.Domain.Entities;
using FitX.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FitX.Persistence.Repositories;

public class ProfessorRepository : Repository<Professor>, IProfessorRepository
{
    public ProfessorRepository(FitXDbContext context) : base(context)
    {
    }

    public async Task<Professor?> GetByUsuarioIdAsync(Guid usuarioId)
    {
        return await _dbSet
            .Include(p => p.Usuario)
            .FirstOrDefaultAsync(p => p.UsuarioId == usuarioId);
    }

    public async Task<Professor?> GetDetailedByIdAsync(Guid id)
    {
        return await _dbSet
            .Include(p => p.Usuario)
            .Include(p => p.Alunos)
                .ThenInclude(a => a.Usuario)
            .Include(p => p.Aulas)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<IEnumerable<Professor>> GetAllWithDetailsAsync()
    {
        return await _dbSet
            .Include(p => p.Usuario)
            .Where(p => p.Ativo)
            .ToListAsync();
    }
}

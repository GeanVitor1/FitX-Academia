using FitX.Domain.Entities;
using FitX.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FitX.Persistence.Repositories;

public class TreinoRepository : Repository<Treino>, ITreinoRepository
{
    public TreinoRepository(FitXDbContext context) : base(context)
    {
    }

    public async Task<Treino?> GetDetailedByIdAsync(Guid id)
    {
        return await _dbSet
            .Include(t => t.Aluno)
                .ThenInclude(a => a.Usuario)
            .Include(t => t.Professor)
                .ThenInclude(p => p.Usuario)
            .Include(t => t.Series)
                .ThenInclude(s => s.Exercicio)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<IEnumerable<Treino>> GetByAlunoIdAsync(Guid alunoId)
    {
        return await _dbSet
            .Include(t => t.Professor)
                .ThenInclude(p => p.Usuario)
            .Include(t => t.Series)
                .ThenInclude(s => s.Exercicio)
            .Where(t => t.AlunoId == alunoId && t.Ativo)
            .ToListAsync();
    }

    public async Task<IEnumerable<Treino>> GetByProfessorIdAsync(Guid professorId)
    {
        return await _dbSet
            .Include(t => t.Aluno)
                .ThenInclude(a => a.Usuario)
            .Include(t => t.Series)
            .Where(t => t.ProfessorId == professorId && t.Ativo)
            .ToListAsync();
    }

    public async Task<IEnumerable<Treino>> GetAllWithDetailsAsync()
    {
        return await _dbSet
            .Include(t => t.Aluno)
                .ThenInclude(a => a.Usuario)
            .Include(t => t.Professor)
                .ThenInclude(p => p.Usuario)
            .Where(t => t.Ativo)
            .ToListAsync();
    }
}

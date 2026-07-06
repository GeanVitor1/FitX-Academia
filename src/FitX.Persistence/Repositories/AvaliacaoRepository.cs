using FitX.Domain.Entities;
using FitX.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FitX.Persistence.Repositories;

public class AvaliacaoRepository : Repository<Avaliacao>, IAvaliacaoRepository
{
    public AvaliacaoRepository(FitXDbContext context) : base(context) { }

    public async Task<IEnumerable<Avaliacao>> GetByAlunoIdAsync(Guid alunoId)
    {
        return await _dbSet
            .Include(a => a.Aluno).ThenInclude(a => a.Usuario)
            .Include(a => a.Professor).ThenInclude(p => p.Usuario)
            .Where(a => a.AlunoId == alunoId && a.Ativo)
            .OrderByDescending(a => a.Data)
            .ToListAsync();
    }

    public async Task<Avaliacao?> GetDetailedByIdAsync(Guid id)
    {
        return await _dbSet
            .Include(a => a.Aluno).ThenInclude(a => a.Usuario)
            .Include(a => a.Professor).ThenInclude(p => p.Usuario)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<IEnumerable<Avaliacao>> GetByProfessorIdAsync(Guid professorId)
    {
        return await _dbSet
            .Include(a => a.Aluno).ThenInclude(a => a.Usuario)
            .Include(a => a.Professor)
            .Where(a => a.ProfessorId == professorId && a.Ativo)
            .OrderByDescending(a => a.Data)
            .ToListAsync();
    }
}

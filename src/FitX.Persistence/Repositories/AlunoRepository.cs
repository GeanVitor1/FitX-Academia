using FitX.Domain.Entities;
using FitX.Domain.Enums;
using FitX.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FitX.Persistence.Repositories;

public class AlunoRepository : Repository<Aluno>, IAlunoRepository
{
    public AlunoRepository(FitXDbContext context) : base(context)
    {
    }

    public async Task<Aluno?> GetByUsuarioIdAsync(Guid usuarioId)
    {
        return await _dbSet
            .Include(a => a.Usuario)
            .Include(a => a.Professor)
                .ThenInclude(p => p.Usuario)
            .Include(a => a.Plano)
            .FirstOrDefaultAsync(a => a.UsuarioId == usuarioId);
    }

    public async Task<Aluno?> GetDetailedByIdAsync(Guid id)
    {
        return await _dbSet
            .Include(a => a.Usuario)
            .Include(a => a.Professor)
                .ThenInclude(p => p.Usuario)
            .Include(a => a.Plano)
            .Include(a => a.Treinos)
            .Include(a => a.Avaliacoes)
            .Include(a => a.Mensalidades)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<IEnumerable<Aluno>> GetAllWithDetailsAsync()
    {
        return await _dbSet
            .Include(a => a.Usuario)
            .Include(a => a.Professor)
                .ThenInclude(p => p.Usuario)
            .Include(a => a.Plano)
            .Where(a => a.Ativo)
            .ToListAsync();
    }

    public async Task<IEnumerable<Aluno>> GetByProfessorIdAsync(Guid professorId)
    {
        return await _dbSet
            .Include(a => a.Usuario)
            .Include(a => a.Plano)
            .Where(a => a.ProfessorId == professorId && a.Ativo)
            .ToListAsync();
    }

    public async Task<IEnumerable<Aluno>> GetByStatusAsync(StatusAluno status)
    {
        return await _dbSet
            .Include(a => a.Usuario)
            .Include(a => a.Plano)
            .Where(a => a.Status == status && a.Ativo)
            .ToListAsync();
    }
}

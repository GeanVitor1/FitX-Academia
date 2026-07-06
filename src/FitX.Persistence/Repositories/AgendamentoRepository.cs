using FitX.Domain.Entities;
using FitX.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FitX.Persistence.Repositories;

public class AgendamentoRepository : Repository<Agendamento>, IAgendamentoRepository
{
    public AgendamentoRepository(FitXDbContext context) : base(context) { }

    public async Task<IEnumerable<Agendamento>> GetByAlunoIdAsync(Guid alunoId)
    {
        return await _dbSet
            .Include(a => a.Aluno).ThenInclude(a => a.Usuario)
            .Include(a => a.Aula).ThenInclude(au => au.Professor).ThenInclude(p => p.Usuario)
            .Where(a => a.AlunoId == alunoId && a.Ativo)
            .OrderByDescending(a => a.Data)
            .ToListAsync();
    }

    public async Task<IEnumerable<Agendamento>> GetByAulaIdAsync(Guid aulaId)
    {
        return await _dbSet
            .Include(a => a.Aluno).ThenInclude(a => a.Usuario)
            .Include(a => a.Aula)
            .Where(a => a.AulaId == aulaId && a.Ativo)
            .ToListAsync();
    }

    public async Task<Agendamento?> GetDetailedByIdAsync(Guid id)
    {
        return await _dbSet
            .Include(a => a.Aluno).ThenInclude(a => a.Usuario)
            .Include(a => a.Aula).ThenInclude(au => au.Professor).ThenInclude(p => p.Usuario)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<IEnumerable<Agendamento>> GetByDataAsync(DateTime data)
    {
        return await _dbSet
            .Include(a => a.Aluno).ThenInclude(a => a.Usuario)
            .Include(a => a.Aula).ThenInclude(au => au.Professor).ThenInclude(p => p.Usuario)
            .Where(a => a.Data.Date == data.Date && a.Ativo)
            .ToListAsync();
    }
}

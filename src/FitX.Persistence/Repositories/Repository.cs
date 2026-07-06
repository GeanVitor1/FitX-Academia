using System.Linq.Expressions;
using FitX.Domain.Entities;
using FitX.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FitX.Persistence.Repositories;

public class Repository<T> : IRepository<T> where T : class, IEntity
{
    protected readonly FitXDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public Repository(FitXDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public async Task<T?> GetByIdAsync(Guid id)
    {
        return await _dbSet.FindAsync(id);
    }

    public async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _dbSet.Where(e => e.Ativo).ToListAsync();
    }

    public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
    {
        return await _dbSet.Where(predicate).ToListAsync();
    }

    public async Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate)
    {
        return await _dbSet.FirstOrDefaultAsync(predicate);
    }

    public async Task<int> CountAsync(Expression<Func<T, bool>>? predicate = null)
    {
        if (predicate is null)
            return await _dbSet.CountAsync();
        return await _dbSet.CountAsync(predicate);
    }

    public async Task<bool> AnyAsync(Expression<Func<T, bool>> predicate)
    {
        return await _dbSet.AnyAsync(predicate);
    }

    public async Task AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
    }

    public void Update(T entity)
    {
        entity.AtualizadoEm = DateTime.UtcNow;
        _dbSet.Update(entity);
    }

    public void Remove(T entity)
    {
        entity.Ativo = false;
        _dbSet.Update(entity);
    }

    public async Task AddRangeAsync(IEnumerable<T> entities)
    {
        await _dbSet.AddRangeAsync(entities);
    }

    public void RemoveRange(IEnumerable<T> entities)
    {
        foreach (var entity in entities)
        {
            entity.Ativo = false;
        }
        _dbSet.UpdateRange(entities);
    }
}

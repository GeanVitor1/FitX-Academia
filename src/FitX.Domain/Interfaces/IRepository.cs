using System.Linq.Expressions;
using FitX.Domain.Entities;

namespace FitX.Domain.Interfaces;

public interface IRepository<T> where T : class, IEntity
{
    Task<T?> GetByIdAsync(Guid id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
    Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate);
    Task<int> CountAsync(Expression<Func<T, bool>>? predicate = null);
    Task<bool> AnyAsync(Expression<Func<T, bool>> predicate);
    Task AddAsync(T entity);
    void Update(T entity);
    void Remove(T entity);
    Task AddRangeAsync(IEnumerable<T> entities);
    void RemoveRange(IEnumerable<T> entities);
}

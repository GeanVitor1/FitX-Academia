using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace FitX.Persistence.Design;

public class FitXDbContextFactory : IDesignTimeDbContextFactory<FitXDbContext>
{
    public FitXDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<FitXDbContext>();
        optionsBuilder.UseSqlite("Data Source=FitX.db");

        return new FitXDbContext(optionsBuilder.Options);
    }
}

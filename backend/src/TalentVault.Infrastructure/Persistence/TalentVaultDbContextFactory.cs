using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace TalentVault.Infrastructure.Persistence;

public class TalentVaultDbContextFactory : IDesignTimeDbContextFactory<TalentVaultDbContext>
{
    public TalentVaultDbContext CreateDbContext(string[] args)
    {
        var connectionString = Environment.GetEnvironmentVariable("TALENTVAULT_CONNECTION_STRING")
            ?? "Host=localhost;Port=5432;Database=talentvault_dev;Username=postgres;Password=postgres";

        var optionsBuilder = new DbContextOptionsBuilder<TalentVaultDbContext>();
        optionsBuilder.UseNpgsql(connectionString);

        return new TalentVaultDbContext(optionsBuilder.Options);
    }
}
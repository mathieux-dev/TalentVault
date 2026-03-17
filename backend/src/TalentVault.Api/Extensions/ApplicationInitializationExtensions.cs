using Microsoft.EntityFrameworkCore;
using TalentVault.Domain.Entities;
using TalentVault.Infrastructure.Persistence;

namespace TalentVault.Api.Extensions;

public static class ApplicationInitializationExtensions
{
    public static async Task InitializeDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();

        var initializationOptions = configuration
            .GetSection(DatabaseInitializationOptions.SectionName)
            .Get<DatabaseInitializationOptions>() ?? new DatabaseInitializationOptions();

        if (!initializationOptions.ApplyMigrationsOnStartup)
        {
            return;
        }

        var dbContext = scope.ServiceProvider.GetRequiredService<TalentVaultDbContext>();
        await dbContext.Database.MigrateAsync();

        var seedOptions = configuration
            .GetSection(SeedOptions.SectionName)
            .Get<SeedOptions>() ?? new SeedOptions();

        if (!seedOptions.Enabled)
        {
            return;
        }

        await SeedAsync(dbContext, seedOptions);
    }

    private static async Task SeedAsync(TalentVaultDbContext dbContext, SeedOptions seedOptions)
    {
        var company = await dbContext.Companies.FirstOrDefaultAsync(c => c.Name == seedOptions.CompanyName);
        if (company == null)
        {
            company = new Company
            {
                Id = Guid.NewGuid(),
                Name = seedOptions.CompanyName,
                CreatedAt = DateTime.UtcNow
            };

            dbContext.Companies.Add(company);
            await dbContext.SaveChangesAsync();
        }

        await EnsureUserAsync(dbContext, company.Id, seedOptions.Admin);
        await EnsureUserAsync(dbContext, company.Id, seedOptions.Hr);
    }

    private static async Task EnsureUserAsync(TalentVaultDbContext dbContext, Guid companyId, SeedUserOptions userOptions)
    {
        var existingUser = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == userOptions.Email);
        if (existingUser != null)
        {
            return;
        }

        dbContext.Users.Add(new User
        {
            Id = Guid.NewGuid(),
            CompanyId = companyId,
            Name = userOptions.Name,
            Email = userOptions.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(userOptions.Password),
            Role = userOptions.Role,
            CreatedAt = DateTime.UtcNow
        });

        await dbContext.SaveChangesAsync();
    }
}

public class DatabaseInitializationOptions
{
    public const string SectionName = "DatabaseInitialization";

    public bool ApplyMigrationsOnStartup { get; set; }
}

public class SeedOptions
{
    public const string SectionName = "Seed";

    public bool Enabled { get; set; }
    public string CompanyName { get; set; } = "TalentVault Demo";
    public SeedUserOptions Admin { get; set; } = new();
    public SeedUserOptions Hr { get; set; } = new();
}

public class SeedUserOptions
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}
using Microsoft.EntityFrameworkCore;
using TalentVault.Application.Repositories;
using TalentVault.Domain.Entities;
using TalentVault.Infrastructure.Persistence;

namespace TalentVault.Infrastructure.Repositories;

public class CompanyRepository : ICompanyRepository
{
    private readonly TalentVaultDbContext _context;

    public CompanyRepository(TalentVaultDbContext context)
    {
        _context = context;
    }

    public async Task<Company?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Companies.FindAsync(new object[] { id }, cancellationToken);
    }

    public async Task<Company?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        return await _context.Companies
            .FirstOrDefaultAsync(c => c.Slug == slug, cancellationToken);
    }

    public async Task<IEnumerable<Company>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Companies.ToListAsync(cancellationToken);
    }

    public async Task<Company> CreateAsync(Company company, CancellationToken cancellationToken = default)
    {
        _context.Companies.Add(company);
        await _context.SaveChangesAsync(cancellationToken);
        return company;
    }

    public async Task<Company> UpdateAsync(Company company, CancellationToken cancellationToken = default)
    {
        _context.Companies.Update(company);
        await _context.SaveChangesAsync(cancellationToken);
        return company;
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var company = await GetByIdAsync(id, cancellationToken);
        if (company != null)
        {
            _context.Companies.Remove(company);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}

using Microsoft.EntityFrameworkCore;
using TalentVault.Application.Repositories;
using TalentVault.Domain.Entities;
using TalentVault.Infrastructure.Persistence;

namespace TalentVault.Infrastructure.Repositories;

public class CandidateRepository : ICandidateRepository
{
    private readonly TalentVaultDbContext _context;

    public CandidateRepository(TalentVaultDbContext context)
    {
        _context = context;
    }

    public async Task<Candidate?> GetByIdAsync(Guid id, Guid companyId, CancellationToken cancellationToken = default)
    {
        return await _context.Candidates
            .FirstOrDefaultAsync(c => c.Id == id && c.CompanyId == companyId, cancellationToken);
    }

    public async Task<IEnumerable<Candidate>> GetByCompanyAsync(Guid companyId, int page, int pageSize, CancellationToken cancellationToken = default)
    {
        return await _context.Candidates
            .Where(c => c.CompanyId == companyId)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }

    public async Task<int> GetCountByCompanyAsync(Guid companyId, CancellationToken cancellationToken = default)
    {
        return await _context.Candidates
            .Where(c => c.CompanyId == companyId)
            .CountAsync(cancellationToken);
    }

    public async Task<Candidate> CreateAsync(Candidate candidate, CancellationToken cancellationToken = default)
    {
        _context.Candidates.Add(candidate);
        await _context.SaveChangesAsync(cancellationToken);
        return candidate;
    }

    public async Task<Candidate> UpdateAsync(Candidate candidate, CancellationToken cancellationToken = default)
    {
        _context.Candidates.Update(candidate);
        await _context.SaveChangesAsync(cancellationToken);
        return candidate;
    }

    public async Task DeleteAsync(Guid id, Guid companyId, CancellationToken cancellationToken = default)
    {
        var candidate = await GetByIdAsync(id, companyId, cancellationToken);
        if (candidate != null)
        {
            _context.Candidates.Remove(candidate);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}

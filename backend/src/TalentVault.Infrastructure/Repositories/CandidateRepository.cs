using Microsoft.EntityFrameworkCore;
using TalentVault.Application.DTOs.Candidates;
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

    public async Task<IEnumerable<Candidate>> GetByCompanyAsync(Guid companyId, int page, int pageSize, CandidateFilters? filters = null, CancellationToken cancellationToken = default)
    {
        return await BuildFilteredQuery(companyId, filters)
            .OrderByDescending(c => c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }

    public async Task<int> GetCountByCompanyAsync(Guid companyId, CandidateFilters? filters = null, CancellationToken cancellationToken = default)
    {
        return await BuildFilteredQuery(companyId, filters)
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

    private IQueryable<Candidate> BuildFilteredQuery(Guid companyId, CandidateFilters? filters)
    {
        var query = _context.Candidates
            .Where(c => c.CompanyId == companyId);

        if (!string.IsNullOrWhiteSpace(filters?.City))
        {
            var normalizedCity = filters.City.Trim().ToLowerInvariant();
            query = query.Where(candidate => candidate.City.ToLower().Contains(normalizedCity));
        }

        if (!string.IsNullOrWhiteSpace(filters?.Seniority))
        {
            var normalizedSeniority = filters.Seniority.Trim().ToLowerInvariant();
            query = query.Where(candidate => candidate.Seniority.ToLower() == normalizedSeniority);
        }

        var normalizedSkills = filters?.Skills?
            .Where(skill => !string.IsNullOrWhiteSpace(skill))
            .Select(skill => skill.Trim().ToLowerInvariant())
            .Distinct()
            .ToList();

        if (normalizedSkills != null && normalizedSkills.Count > 0)
        {
            query = query.Where(candidate => _context.CandidateSkills
                .Any(candidateSkill =>
                    candidateSkill.CandidateId == candidate.Id &&
                    normalizedSkills.Contains(candidateSkill.Skill.Name.ToLower())));
        }

        return query;
    }
}

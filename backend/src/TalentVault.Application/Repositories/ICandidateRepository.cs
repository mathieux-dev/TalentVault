using TalentVault.Domain.Entities;
using TalentVault.Application.DTOs.Candidates;

namespace TalentVault.Application.Repositories;

public interface ICandidateRepository
{
    Task<Candidate?> GetByIdAsync(Guid id, Guid companyId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Candidate>> GetByCompanyAsync(Guid companyId, int page, int pageSize, CandidateFilters? filters = null, CancellationToken cancellationToken = default);
    Task<int> GetCountByCompanyAsync(Guid companyId, CandidateFilters? filters = null, CancellationToken cancellationToken = default);
    Task<Candidate> CreateAsync(Candidate candidate, CancellationToken cancellationToken = default);
    Task<Candidate> UpdateAsync(Candidate candidate, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, Guid companyId, CancellationToken cancellationToken = default);
}

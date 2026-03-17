using TalentVault.Domain.Entities;

namespace TalentVault.Application.Repositories;

public interface ICandidateRepository
{
    Task<Candidate?> GetByIdAsync(Guid id, Guid companyId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Candidate>> GetByCompanyAsync(Guid companyId, int page, int pageSize, CancellationToken cancellationToken = default);
    Task<int> GetCountByCompanyAsync(Guid companyId, CancellationToken cancellationToken = default);
    Task<Candidate> CreateAsync(Candidate candidate, CancellationToken cancellationToken = default);
    Task<Candidate> UpdateAsync(Candidate candidate, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, Guid companyId, CancellationToken cancellationToken = default);
}

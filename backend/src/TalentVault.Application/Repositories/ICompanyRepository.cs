using TalentVault.Domain.Entities;

namespace TalentVault.Application.Repositories;

public interface ICompanyRepository
{
    Task<Company?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Company?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
    Task<IEnumerable<Company>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Company> CreateAsync(Company company, CancellationToken cancellationToken = default);
    Task<Company> UpdateAsync(Company company, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}

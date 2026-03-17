using TalentVault.Domain.Entities;

namespace TalentVault.Application.Repositories;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<User?> GetByEmailAsync(Guid companyId, string email, CancellationToken cancellationToken = default);
    Task<IEnumerable<User>> GetByCompanyAsync(Guid companyId, CancellationToken cancellationToken = default);
    Task<User> CreateAsync(User user, CancellationToken cancellationToken = default);
    Task<User> UpdateAsync(User user, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}

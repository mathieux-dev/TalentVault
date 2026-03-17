using TalentVault.Domain.Entities;

namespace TalentVault.Application.Repositories;

public interface ISkillRepository
{
    Task<Skill?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Skill?> GetByNameAsync(string name, CancellationToken cancellationToken = default);
    Task<IEnumerable<Skill>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Skill> CreateAsync(Skill skill, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}

using Microsoft.EntityFrameworkCore;
using TalentVault.Application.Repositories;
using TalentVault.Domain.Entities;
using TalentVault.Infrastructure.Persistence;

namespace TalentVault.Infrastructure.Repositories;

public class SkillRepository : ISkillRepository
{
    private readonly TalentVaultDbContext _context;

    public SkillRepository(TalentVaultDbContext context)
    {
        _context = context;
    }

    public async Task<Skill?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Skills.FindAsync(new object[] { id }, cancellationToken);
    }

    public async Task<Skill?> GetByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        return await _context.Skills
            .FirstOrDefaultAsync(s => s.Name == name, cancellationToken);
    }

    public async Task<IEnumerable<Skill>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Skills.ToListAsync(cancellationToken);
    }

    public async Task<Skill> CreateAsync(Skill skill, CancellationToken cancellationToken = default)
    {
        _context.Skills.Add(skill);
        await _context.SaveChangesAsync(cancellationToken);
        return skill;
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var skill = await GetByIdAsync(id, cancellationToken);
        if (skill != null)
        {
            _context.Skills.Remove(skill);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}

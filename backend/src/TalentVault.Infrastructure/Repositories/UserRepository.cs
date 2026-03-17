using Microsoft.EntityFrameworkCore;
using TalentVault.Application.Repositories;
using TalentVault.Domain.Entities;
using TalentVault.Infrastructure.Persistence;

namespace TalentVault.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly TalentVaultDbContext _context;

    public UserRepository(TalentVaultDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Users.FindAsync(new object[] { id }, cancellationToken);
    }

    public async Task<User?> GetByEmailAsync(Guid companyId, string email, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.CompanyId == companyId && u.Email == email, cancellationToken);
    }

    public async Task<IEnumerable<User>> GetByCompanyAsync(Guid companyId, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .Where(u => u.CompanyId == companyId)
            .ToListAsync(cancellationToken);
    }

    public async Task<User> CreateAsync(User user, CancellationToken cancellationToken = default)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);
        return user;
    }

    public async Task<User> UpdateAsync(User user, CancellationToken cancellationToken = default)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync(cancellationToken);
        return user;
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var user = await GetByIdAsync(id, cancellationToken);
        if (user != null)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}

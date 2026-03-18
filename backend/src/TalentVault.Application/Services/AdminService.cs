using System.Text;
using TalentVault.Application.DTOs.Admin;
using TalentVault.Application.Repositories;
using TalentVault.Domain.Entities;

namespace TalentVault.Application.Services;

public interface IAdminService
{
    Task<CompanyResponse> CreateCompanyAsync(CreateCompanyRequest request, CancellationToken cancellationToken = default);
    Task<IEnumerable<CompanyResponse>> GetCompaniesAsync(CancellationToken cancellationToken = default);
    Task<CompanyUserResponse> CreateCompanyUserAsync(Guid companyId, CreateCompanyUserRequest request, CancellationToken cancellationToken = default);
    Task<IEnumerable<CompanyUserResponse>> GetCompanyUsersAsync(Guid companyId, CancellationToken cancellationToken = default);
}

public class AdminService : IAdminService
{
    private static readonly HashSet<string> AllowedRoles = new(StringComparer.OrdinalIgnoreCase)
    {
        "Admin",
        "HR"
    };

    private readonly ICompanyRepository _companyRepository;
    private readonly IUserRepository _userRepository;

    public AdminService(ICompanyRepository companyRepository, IUserRepository userRepository)
    {
        _companyRepository = companyRepository;
        _userRepository = userRepository;
    }

    public async Task<CompanyResponse> CreateCompanyAsync(CreateCompanyRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            throw new InvalidOperationException("Nome da empresa é obrigatório");
        }

        var normalizedSlug = NormalizeSlug(request.Slug, request.Name);
        if (string.IsNullOrWhiteSpace(normalizedSlug))
        {
            throw new InvalidOperationException("Slug da empresa inválido");
        }

        var existingCompany = await _companyRepository.GetBySlugAsync(normalizedSlug, cancellationToken);
        if (existingCompany != null)
        {
            throw new InvalidOperationException("Já existe uma empresa com este slug");
        }

        var company = await _companyRepository.CreateAsync(new Company
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Slug = normalizedSlug,
            CreatedAt = DateTime.UtcNow
        }, cancellationToken);

        return MapCompany(company);
    }

    public async Task<IEnumerable<CompanyResponse>> GetCompaniesAsync(CancellationToken cancellationToken = default)
    {
        var companies = await _companyRepository.GetAllAsync(cancellationToken);
        return companies
            .OrderBy(company => company.Name)
            .Select(MapCompany)
            .ToList();
    }

    public async Task<CompanyUserResponse> CreateCompanyUserAsync(Guid companyId, CreateCompanyUserRequest request, CancellationToken cancellationToken = default)
    {
        var company = await _companyRepository.GetByIdAsync(companyId, cancellationToken);
        if (company == null)
        {
            throw new InvalidOperationException("Empresa não encontrada");
        }

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            throw new InvalidOperationException("Nome do usuário é obrigatório");
        }

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            throw new InvalidOperationException("Email é obrigatório");
        }

        if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 6)
        {
            throw new InvalidOperationException("Senha deve ter pelo menos 6 caracteres");
        }

        var normalizedRole = NormalizeRole(request.Role);
        if (!AllowedRoles.Contains(normalizedRole))
        {
            throw new InvalidOperationException("Role inválida. Use Admin ou HR");
        }

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var existingUser = await _userRepository.GetByEmailAsync(companyId, normalizedEmail, cancellationToken);
        if (existingUser != null)
        {
            throw new InvalidOperationException("Já existe um usuário com este email nesta empresa");
        }

        var user = await _userRepository.CreateAsync(new User
        {
            Id = Guid.NewGuid(),
            CompanyId = companyId,
            Name = request.Name.Trim(),
            Email = normalizedEmail,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = normalizedRole,
            CreatedAt = DateTime.UtcNow
        }, cancellationToken);

        return MapUser(user);
    }

    public async Task<IEnumerable<CompanyUserResponse>> GetCompanyUsersAsync(Guid companyId, CancellationToken cancellationToken = default)
    {
        var company = await _companyRepository.GetByIdAsync(companyId, cancellationToken);
        if (company == null)
        {
            throw new InvalidOperationException("Empresa não encontrada");
        }

        var users = await _userRepository.GetByCompanyAsync(companyId, cancellationToken);
        return users
            .OrderBy(user => user.Name)
            .Select(MapUser)
            .ToList();
    }

    private static CompanyResponse MapCompany(Company company)
    {
        return new CompanyResponse(
            company.Id,
            company.Name,
            company.Slug,
            company.CreatedAt);
    }

    private static CompanyUserResponse MapUser(User user)
    {
        return new CompanyUserResponse(
            user.Id,
            user.CompanyId,
            user.Name,
            user.Email,
            user.Role,
            user.CreatedAt);
    }

    private static string NormalizeSlug(string? rawSlug, string fallbackName)
    {
        var source = string.IsNullOrWhiteSpace(rawSlug)
            ? fallbackName
            : rawSlug;

        var normalized = source.Trim().ToLowerInvariant();
        var slugBuilder = new StringBuilder();
        var lastWasDash = false;

        foreach (var character in normalized)
        {
            if (char.IsLetterOrDigit(character))
            {
                slugBuilder.Append(character);
                lastWasDash = false;
                continue;
            }

            if (!lastWasDash)
            {
                slugBuilder.Append('-');
                lastWasDash = true;
            }
        }

        return slugBuilder.ToString().Trim('-');
    }

    private static string NormalizeRole(string? role)
    {
        return (role ?? string.Empty).Trim() switch
        {
            var value when value.Equals("admin", StringComparison.OrdinalIgnoreCase) => "Admin",
            var value when value.Equals("hr", StringComparison.OrdinalIgnoreCase) => "HR",
            _ => role?.Trim() ?? string.Empty
        };
    }
}
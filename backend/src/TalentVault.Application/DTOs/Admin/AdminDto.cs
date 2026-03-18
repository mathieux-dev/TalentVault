namespace TalentVault.Application.DTOs.Admin;

public record CreateCompanyRequest(
    string Name,
    string? Slug);

public record CompanyResponse(
    Guid Id,
    string Name,
    string Slug,
    DateTime CreatedAt);

public record CreateCompanyUserRequest(
    string Name,
    string Email,
    string Password,
    string Role);

public record CompanyUserResponse(
    Guid Id,
    Guid CompanyId,
    string Name,
    string Email,
    string Role,
    DateTime CreatedAt);
namespace TalentVault.Application.DTOs.Auth;

public record LoginRequest(string Email, string Password);

public record LoginResponse(string Token, Guid UserId, Guid CompanyId, string Role);

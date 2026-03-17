using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace TalentVault.Application.Services;

public interface IAuthService
{
    string GenerateJwtToken(Guid userId, Guid companyId, string role);
}

public class AuthService : IAuthService
{
    private const string SecretKey = "your-secret-key-change-this-in-production-at-least-32-characters-long";
    private const string Issuer = "TalentVault";
    private const string Audience = "TalentVaultUsers";
    private const int ExpirationMinutes = 480; // 8 hours

    public string GenerateJwtToken(Guid userId, Guid companyId, string role)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim("companyId", companyId.ToString()),
            new Claim(ClaimTypes.Role, role)
        };

        var token = new JwtSecurityToken(
            issuer: Issuer,
            audience: Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(ExpirationMinutes),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

using Microsoft.AspNetCore.Mvc;
using TalentVault.Application.DTOs.Auth;
using TalentVault.Application.Repositories;
using TalentVault.Application.Services;

namespace TalentVault.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly IAuthService _authService;

    public AuthController(IUserRepository userRepository, IAuthService authService)
    {
        _userRepository = userRepository;
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
        {
            return BadRequest(new
            {
                success = false,
                data = (object?)null,
                errors = new[] { "Email and password are required" }
            });
        }

        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return Unauthorized(new
            {
                success = false,
                data = (object?)null,
                errors = new[] { "Invalid credentials" }
            });
        }

        var token = _authService.GenerateJwtToken(user.Id, user.CompanyId, user.Role);
        var response = new LoginResponse(token, user.Id, user.CompanyId, user.Role, user.Email, user.Name);

        return Ok(new
        {
            success = true,
            data = response,
            errors = Array.Empty<string>()
        });
    }
}

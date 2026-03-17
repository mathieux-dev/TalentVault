using Microsoft.AspNetCore.Mvc;
using TalentVault.Application.DTOs.Auth;
using TalentVault.Application.Repositories;
using TalentVault.Application.Services;
using BCrypt.Net;

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
        // This is a basic implementation - in a real app, you'd need to validate the user exists first
        // For now, we'll assume the user exists and validate credentials
        
        if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
        {
            return BadRequest(new
            {
                success = false,
                errors = new[] { "Email and password are required" }
            });
        }

        // In a production system, you'd need to know the CompanyId first
        // This is a placeholder that would need to be adjusted based on your auth flow
        return Unauthorized(new
        {
            success = false,
            errors = new[] { "Invalid credentials" }
        });
    }
}

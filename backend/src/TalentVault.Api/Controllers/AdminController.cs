using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TalentVault.Application.DTOs.Admin;
using TalentVault.Application.Services;

namespace TalentVault.Api.Controllers;

[ApiController]
[Route("api/v1/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet("companies")]
    public async Task<IActionResult> GetCompanies(CancellationToken cancellationToken)
    {
        try
        {
            var companies = await _adminService.GetCompaniesAsync(cancellationToken);
            return Ok(new
            {
                success = true,
                data = companies,
                errors = Array.Empty<string>()
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                success = false,
                errors = new[] { ex.Message }
            });
        }
    }

    [HttpPost("companies")]
    public async Task<IActionResult> CreateCompany([FromBody] CreateCompanyRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var company = await _adminService.CreateCompanyAsync(request, cancellationToken);
            return CreatedAtAction(nameof(GetCompanies), new
            {
                success = true,
                data = company,
                errors = Array.Empty<string>()
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new
            {
                success = false,
                errors = new[] { ex.Message }
            });
        }
    }

    [HttpGet("companies/{companyId:guid}/users")]
    public async Task<IActionResult> GetCompanyUsers([FromRoute] Guid companyId, CancellationToken cancellationToken)
    {
        try
        {
            var users = await _adminService.GetCompanyUsersAsync(companyId, cancellationToken);
            return Ok(new
            {
                success = true,
                data = users,
                errors = Array.Empty<string>()
            });
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new
            {
                success = false,
                errors = new[] { ex.Message }
            });
        }
    }

    [HttpPost("companies/{companyId:guid}/users")]
    public async Task<IActionResult> CreateCompanyUser([FromRoute] Guid companyId, [FromBody] CreateCompanyUserRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var user = await _adminService.CreateCompanyUserAsync(companyId, request, cancellationToken);
            return CreatedAtAction(nameof(GetCompanyUsers), new { companyId }, new
            {
                success = true,
                data = user,
                errors = Array.Empty<string>()
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new
            {
                success = false,
                errors = new[] { ex.Message }
            });
        }
    }
}
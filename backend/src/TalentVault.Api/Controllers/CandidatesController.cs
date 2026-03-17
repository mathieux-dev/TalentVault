using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TalentVault.Application.DTOs.Candidates;
using TalentVault.Application.Services;

namespace TalentVault.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class CandidatesController : ControllerBase
{
    private readonly ICandidateService _candidateService;

    public CandidatesController(ICandidateService candidateService)
    {
        _candidateService = candidateService;
    }

    /// <summary>
    /// Get current user's company ID from JWT token
    /// </summary>
    private Guid GetCompanyIdFromToken()
    {
        var companyIdClaim = User.FindFirst("companyId");
        if (companyIdClaim == null || !Guid.TryParse(companyIdClaim.Value, out var companyId))
        {
            throw new UnauthorizedAccessException("Company ID not found in token");
        }
        return companyId;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCandidateRequest request, CancellationToken cancellationToken)
    {
        var companyId = GetCompanyIdFromToken();

        try
        {
            var candidate = await _candidateService.CreateAsync(companyId, request, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = candidate.Id }, new
            {
                success = true,
                data = candidate,
                errors = new string[] { }
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

    [HttpGet]
    public async Task<IActionResult> GetList([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken cancellationToken = default)
    {
        var companyId = GetCompanyIdFromToken();

        try
        {
            var candidates = await _candidateService.GetByCompanyAsync(companyId, page, pageSize, cancellationToken);
            return Ok(new
            {
                success = true,
                data = candidates,
                errors = new string[] { }
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

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById([FromRoute] Guid id, CancellationToken cancellationToken)
    {
        var companyId = GetCompanyIdFromToken();

        try
        {
            var candidate = await _candidateService.GetByIdAsync(id, companyId, cancellationToken);
            if (candidate == null)
            {
                return NotFound(new
                {
                    success = false,
                    errors = new[] { "Candidato não encontrado" }
                });
            }

            return Ok(new
            {
                success = true,
                data = candidate,
                errors = new string[] { }
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

    [HttpPost("{id}/resume")]
    public async Task<IActionResult> UploadResume([FromRoute] Guid id, IFormFile file, CancellationToken cancellationToken)
    {
        var companyId = GetCompanyIdFromToken();

        // Validate file is present
        if (file == null || file.Length == 0)
        {
            return BadRequest(new
            {
                success = false,
                errors = new[] { "Arquivo é obrigatório" }
            });
        }

        // Validate file extension
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (extension != ".pdf")
        {
            return BadRequest(new
            {
                success = false,
                errors = new[] { "Apenas arquivos PDF são permitidos" }
            });
        }

        // Validate file size (5MB)
        if (file.Length > 5 * 1024 * 1024)
        {
            return BadRequest(new
            {
                success = false,
                errors = new[] { "Arquivo não pode exceder 5MB" }
            });
        }

        try
        {
            using (var stream = file.OpenReadStream())
            {
                var resumeUrl = await _candidateService.UploadResumeAsync(id, companyId, stream, file.FileName, cancellationToken);
                return Ok(new
                {
                    success = true,
                    data = new UploadResumeResponse(resumeUrl, "Currículo enviado com sucesso"),
                    errors = new string[] { }
                });
            }
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new
            {
                success = false,
                errors = new[] { ex.Message }
            });
        }
        catch
        {
            return StatusCode(500, new
            {
                success = false,
                errors = new[] { "Erro ao fazer upload do arquivo" }
            });
        }
    }
}

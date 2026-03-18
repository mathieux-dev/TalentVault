using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using TalentVault.Application.DTOs.Candidates;
using TalentVault.Application.Repositories;
using TalentVault.Application.Services;

namespace TalentVault.Api.Controllers;

[ApiController]
[Route("api/v1/public/applications")]
public class PublicApplicationsController : ControllerBase
{
    private readonly ICompanyRepository _companyRepository;
    private readonly ICandidateService _candidateService;
    private readonly IValidator<PublicCandidateSubmissionRequest> _validator;

    public PublicApplicationsController(
        ICompanyRepository companyRepository,
        ICandidateService candidateService,
        IValidator<PublicCandidateSubmissionRequest> validator)
    {
        _companyRepository = companyRepository;
        _candidateService = candidateService;
        _validator = validator;
    }

    [HttpPost("{companySlug}")]
    [EnableRateLimiting("PublicApplicationsPolicy")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Submit(
        [FromRoute] string companySlug,
        [FromForm] PublicCandidateSubmissionRequest request,
        [FromForm] IFormFile? file,
        CancellationToken cancellationToken)
    {
        var company = await _companyRepository.GetBySlugAsync(companySlug.Trim().ToLowerInvariant(), cancellationToken);
        if (company == null)
        {
            return NotFound(new
            {
                success = false,
                errors = new[] { "Empresa não encontrada" }
            });
        }

        var validationResult = await _validator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            return BadRequest(new
            {
                success = false,
                errors = validationResult.Errors.Select(error => error.ErrorMessage).Distinct().ToArray()
            });
        }

        if (file == null || file.Length == 0)
        {
            return BadRequest(new
            {
                success = false,
                errors = new[] { "Currículo em PDF é obrigatório" }
            });
        }

        await using var stream = file.OpenReadStream();
        var candidate = await _candidateService.CreateWithResumeAsync(
            company.Id,
            new CreateCandidateRequest(
                request.Name,
                request.Email,
                request.Phone,
                request.City,
                request.State,
                request.Seniority),
            stream,
            file.FileName,
            cancellationToken);

        return Ok(new
        {
            success = true,
            data = candidate,
            errors = Array.Empty<string>()
        });
    }
}
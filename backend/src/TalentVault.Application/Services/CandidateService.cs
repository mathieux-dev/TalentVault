using TalentVault.Application.DTOs.Candidates;
using TalentVault.Application.Repositories;
using TalentVault.Domain.Entities;

namespace TalentVault.Application.Services;

public interface ICandidateService
{
    Task<CandidateResponse> CreateAsync(Guid companyId, CreateCandidateRequest request, CancellationToken cancellationToken = default);
    Task<CandidateListResponse> GetByCompanyAsync(Guid companyId, int page, int pageSize, CancellationToken cancellationToken = default);
    Task<CandidateResponse?> GetByIdAsync(Guid Id, Guid companyId, CancellationToken cancellationToken = default);
    Task<string> UploadResumeAsync(Guid candidateId, Guid companyId, Stream fileStream, string fileName, CancellationToken cancellationToken = default);
}

public class CandidateService : ICandidateService
{
    private readonly ICandidateRepository _candidateRepository;
    private readonly IStorageService _storageService;

    public CandidateService(ICandidateRepository candidateRepository, IStorageService storageService)
    {
        _candidateRepository = candidateRepository;
        _storageService = storageService;
    }

    public async Task<CandidateResponse> CreateAsync(Guid companyId, CreateCandidateRequest request, CancellationToken cancellationToken = default)
    {
        var candidate = new Candidate
        {
            Id = Guid.NewGuid(),
            CompanyId = companyId,
            Name = request.Name,
            Email = request.Email,
            Phone = request.Phone,
            City = request.City,
            State = request.State,
            Seniority = request.Seniority,
            CreatedAt = DateTime.UtcNow
        };

        var createdCandidate = await _candidateRepository.CreateAsync(candidate, cancellationToken);
        return MapToResponse(createdCandidate);
    }

    public async Task<CandidateListResponse> GetByCompanyAsync(Guid companyId, int page = 1, int pageSize = 20, CancellationToken cancellationToken = default)
    {
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 20;

        var candidates = await _candidateRepository.GetByCompanyAsync(companyId, page, pageSize, cancellationToken);
        var total = await _candidateRepository.GetCountByCompanyAsync(companyId, cancellationToken);

        var items = candidates.Select(MapToResponse).ToList();

        return new CandidateListResponse(items, page, pageSize, total);
    }

    public async Task<CandidateResponse?> GetByIdAsync(Guid id, Guid companyId, CancellationToken cancellationToken = default)
    {
        var candidate = await _candidateRepository.GetByIdAsync(id, companyId, cancellationToken);
        return candidate != null ? MapToResponse(candidate) : null;
    }

    public async Task<string> UploadResumeAsync(Guid candidateId, Guid companyId, Stream fileStream, string fileName, CancellationToken cancellationToken = default)
    {
        // Verify candidate exists and belongs to company
        var candidate = await _candidateRepository.GetByIdAsync(candidateId, companyId, cancellationToken);
        if (candidate == null)
        {
            throw new InvalidOperationException("Candidato não encontrado");
        }

        // Upload file to storage
        var resumeUrl = await _storageService.UploadResumeAsync(candidateId, fileStream, fileName, cancellationToken);

        // Update candidate with resume URL
        candidate.ResumeUrl = resumeUrl;
        await _candidateRepository.UpdateAsync(candidate, cancellationToken);

        return resumeUrl;
    }

    private static CandidateResponse MapToResponse(Candidate candidate)
    {
        return new CandidateResponse(
            candidate.Id,
            candidate.Name,
            candidate.Email,
            candidate.Phone,
            candidate.City,
            candidate.State,
            candidate.Seniority,
            candidate.ResumeUrl,
            candidate.CreatedAt);
    }
}

namespace TalentVault.Application.DTOs.Candidates;

public record CreateCandidateRequest(
    string Name,
    string Email,
    string Phone,
    string City,
    string State,
    string Seniority);

public record CandidateResponse(
    Guid Id,
    string Name,
    string Email,
    string Phone,
    string City,
    string State,
    string Seniority,
    string? ResumeUrl,
    DateTime CreatedAt);

public record CandidateListResponse(
    IEnumerable<CandidateResponse> Items,
    int Page,
    int PageSize,
    int Total);

namespace TalentVault.Application.DTOs.Candidates;

public record CreateCandidateRequest(
    string Name,
    string Email,
    string Phone,
    string City,
    string? State,
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

public record CandidateFilters(
    string? City,
    string? Seniority,
    IEnumerable<string>? Skills);

public class PublicCandidateSubmissionRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string? State { get; set; }
    public string Seniority { get; set; } = string.Empty;
}

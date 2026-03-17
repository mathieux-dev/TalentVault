namespace TalentVault.Domain.Entities;

public class Candidate
{
    public Guid Id { get; set; }
    public Guid CompanyId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Seniority { get; set; } = string.Empty;
    public string? ResumeUrl { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public Company Company { get; set; } = null!;
    public ICollection<CandidateSkill> Skills { get; set; } = new List<CandidateSkill>();
}

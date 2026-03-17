namespace TalentVault.Domain.Entities;

public class Skill
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public ICollection<CandidateSkill> Candidates { get; set; } = new List<CandidateSkill>();
}

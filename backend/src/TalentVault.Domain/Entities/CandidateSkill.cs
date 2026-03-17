namespace TalentVault.Domain.Entities;

public class CandidateSkill
{
    public Guid CandidateId { get; set; }
    public Guid SkillId { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public Candidate Candidate { get; set; } = null!;
    public Skill Skill { get; set; } = null!;
}

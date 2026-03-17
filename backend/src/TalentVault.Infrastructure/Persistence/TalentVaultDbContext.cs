using Microsoft.EntityFrameworkCore;
using TalentVault.Domain.Entities;

namespace TalentVault.Infrastructure.Persistence;

public class TalentVaultDbContext : DbContext
{
    public TalentVaultDbContext(DbContextOptions<TalentVaultDbContext> options)
        : base(options)
    {
    }

    public DbSet<Company> Companies { get; set; } = null!;
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Candidate> Candidates { get; set; } = null!;
    public DbSet<Skill> Skills { get; set; } = null!;
    public DbSet<CandidateSkill> CandidateSkills { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Company configuration
        modelBuilder.Entity<Company>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Slug).IsRequired().HasMaxLength(100);
            entity.Property(e => e.CreatedAt).IsRequired();

            entity.HasIndex(e => e.Slug).IsUnique();
        });

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CompanyId).IsRequired();
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(255);
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.Role).IsRequired().HasMaxLength(50);
            entity.Property(e => e.CreatedAt).IsRequired();

            // Foreign key relationship
            entity.HasOne(e => e.Company)
                .WithMany(c => c.Users)
                .HasForeignKey(e => e.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);

            // Index for email lookup
            entity.HasIndex(e => new { e.CompanyId, e.Email }).IsUnique();
        });

        // Candidate configuration
        modelBuilder.Entity<Candidate>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CompanyId).IsRequired();
            entity.Property(e => e.Name).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Phone).HasMaxLength(20);
            entity.Property(e => e.City).HasMaxLength(100);
            entity.Property(e => e.State).HasMaxLength(50);
            entity.Property(e => e.Seniority).HasMaxLength(50);
            entity.Property(e => e.ResumeUrl).HasMaxLength(500);
            entity.Property(e => e.CreatedAt).IsRequired();

            // Foreign key relationship
            entity.HasOne(e => e.Company)
                .WithMany(c => c.Candidates)
                .HasForeignKey(e => e.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Skill configuration
        modelBuilder.Entity<Skill>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(255);
            entity.Property(e => e.CreatedAt).IsRequired();

            // Index for skill name lookup
            entity.HasIndex(e => e.Name).IsUnique();
        });

        // CandidateSkill configuration (Mapping table)
        modelBuilder.Entity<CandidateSkill>(entity =>
        {
            entity.HasKey(e => new { e.CandidateId, e.SkillId });
            entity.Property(e => e.CreatedAt).IsRequired();

            // Foreign key to Candidate
            entity.HasOne(e => e.Candidate)
                .WithMany(c => c.Skills)
                .HasForeignKey(e => e.CandidateId)
                .OnDelete(DeleteBehavior.Cascade);

            // Foreign key to Skill
            entity.HasOne(e => e.Skill)
                .WithMany(s => s.Candidates)
                .HasForeignKey(e => e.SkillId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}

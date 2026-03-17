using FluentValidation;
using TalentVault.Application.DTOs.Candidates;

namespace TalentVault.Application.Validators;

public class CreateCandidateRequestValidator : AbstractValidator<CreateCandidateRequest>
{
    public CreateCandidateRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Nome é obrigatório")
            .MaximumLength(255).WithMessage("Nome não pode exceder 255 caracteres");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email é obrigatório")
            .EmailAddress().WithMessage("Email inválido")
            .MaximumLength(255).WithMessage("Email não pode exceder 255 caracteres");

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Telefone é obrigatório")
            .MaximumLength(20).WithMessage("Telefone não pode exceder 20 caracteres");

        RuleFor(x => x.City)
            .NotEmpty().WithMessage("Cidade é obrigatória")
            .MaximumLength(100).WithMessage("Cidade não pode exceder 100 caracteres");

        RuleFor(x => x.State)
            .NotEmpty().WithMessage("Estado é obrigatório")
            .MaximumLength(50).WithMessage("Estado não pode exceder 50 caracteres");

        RuleFor(x => x.Seniority)
            .NotEmpty().WithMessage("Senioridade é obrigatória")
            .MaximumLength(50).WithMessage("Senioridade não pode exceder 50 caracteres");
    }
}

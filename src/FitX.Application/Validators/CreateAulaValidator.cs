using FitX.Application.DTOs;
using FluentValidation;

namespace FitX.Application.Validators;

public class CreateAulaValidator : AbstractValidator<CreateAulaDto>
{
    public CreateAulaValidator()
    {
        RuleFor(x => x.Nome)
            .NotEmpty().WithMessage("Nome é obrigatório");

        RuleFor(x => x.ProfessorId)
            .NotEmpty().WithMessage("Professor é obrigatório");

        RuleFor(x => x.Vagas)
            .GreaterThan(0).WithMessage("Vagas deve ser maior que zero");
    }
}

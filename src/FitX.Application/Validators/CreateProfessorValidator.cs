using FitX.Application.DTOs;
using FluentValidation;

namespace FitX.Application.Validators;

public class CreateProfessorValidator : AbstractValidator<CreateProfessorDto>
{
    public CreateProfessorValidator()
    {
        RuleFor(x => x.Nome)
            .NotEmpty().WithMessage("Nome é obrigatório")
            .MinimumLength(3).WithMessage("Nome deve ter no mínimo 3 caracteres");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email é obrigatório")
            .EmailAddress().WithMessage("Email inválido");

        RuleFor(x => x.Especialidade)
            .NotEmpty().WithMessage("Especialidade é obrigatória");

        RuleFor(x => x.CREF)
            .NotEmpty().WithMessage("CREF é obrigatório");
    }
}

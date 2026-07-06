using FitX.Application.DTOs;
using FluentValidation;

namespace FitX.Application.Validators;

public class CreateAvaliacaoValidator : AbstractValidator<CreateAvaliacaoDto>
{
    public CreateAvaliacaoValidator()
    {
        RuleFor(x => x.AlunoId)
            .NotEmpty().WithMessage("Aluno é obrigatório");

        RuleFor(x => x.Peso)
            .GreaterThan(0).WithMessage("Peso deve ser maior que zero");

        RuleFor(x => x.Altura)
            .GreaterThan(0).WithMessage("Altura deve ser maior que zero");
    }
}

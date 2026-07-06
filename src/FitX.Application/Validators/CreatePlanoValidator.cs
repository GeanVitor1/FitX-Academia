using FitX.Application.DTOs;
using FluentValidation;

namespace FitX.Application.Validators;

public class CreatePlanoValidator : AbstractValidator<CreatePlanoDto>
{
    public CreatePlanoValidator()
    {
        RuleFor(x => x.Nome)
            .NotEmpty().WithMessage("Nome é obrigatório");

        RuleFor(x => x.Preco)
            .GreaterThan(0).WithMessage("Preço deve ser maior que zero");

        RuleFor(x => x.DuracaoDias)
            .GreaterThan(0).WithMessage("Duração deve ser maior que zero");
    }
}

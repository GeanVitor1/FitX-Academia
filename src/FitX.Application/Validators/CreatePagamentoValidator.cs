using FitX.Application.DTOs;
using FluentValidation;

namespace FitX.Application.Validators;

public class CreatePagamentoValidator : AbstractValidator<CreatePagamentoDto>
{
    public CreatePagamentoValidator()
    {
        RuleFor(x => x.MensalidadeId)
            .NotEmpty().WithMessage("Mensalidade é obrigatória");

        RuleFor(x => x.Valor)
            .GreaterThan(0).WithMessage("Valor deve ser maior que zero");
    }
}

using FitX.Application.DTOs;
using FluentValidation;

namespace FitX.Application.Validators;

public class CreateMensalidadeValidator : AbstractValidator<CreateMensalidadeDto>
{
    public CreateMensalidadeValidator()
    {
        RuleFor(x => x.AlunoId)
            .NotEmpty().WithMessage("Aluno é obrigatório");

        RuleFor(x => x.PlanoId)
            .NotEmpty().WithMessage("Plano é obrigatório");

        RuleFor(x => x.Valor)
            .GreaterThan(0).WithMessage("Valor deve ser maior que zero");

        RuleFor(x => x.DataVencimento)
            .NotEmpty().WithMessage("Data de vencimento é obrigatória");
    }
}

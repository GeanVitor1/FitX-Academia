using FitX.Application.DTOs;
using FluentValidation;

namespace FitX.Application.Validators;

public class CreateAgendamentoValidator : AbstractValidator<CreateAgendamentoDto>
{
    public CreateAgendamentoValidator()
    {
        RuleFor(x => x.AlunoId)
            .NotEmpty().WithMessage("Aluno é obrigatório");

        RuleFor(x => x.AulaId)
            .NotEmpty().WithMessage("Aula é obrigatória");

        RuleFor(x => x.Data)
            .NotEmpty().WithMessage("Data é obrigatória")
            .GreaterThanOrEqualTo(DateTime.Today).WithMessage("Data não pode ser no passado");
    }
}

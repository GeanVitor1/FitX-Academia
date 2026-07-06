using FitX.Application.DTOs;
using FluentValidation;

namespace FitX.Application.Validators;

public class CreateNotificacaoValidator : AbstractValidator<CreateNotificacaoDto>
{
    public CreateNotificacaoValidator()
    {
        RuleFor(x => x.UsuarioId)
            .NotEmpty().WithMessage("Usuário é obrigatório");

        RuleFor(x => x.Titulo)
            .NotEmpty().WithMessage("Título é obrigatório")
            .MaximumLength(200).WithMessage("Título deve ter no máximo 200 caracteres");

        RuleFor(x => x.Mensagem)
            .NotEmpty().WithMessage("Mensagem é obrigatória");
    }
}

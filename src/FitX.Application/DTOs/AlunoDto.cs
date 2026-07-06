using FitX.Domain.Enums;

namespace FitX.Application.DTOs;

public class AlunoDto
{
    public Guid Id { get; set; }
    public Guid UsuarioId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Telefone { get; set; }
    public Guid? ProfessorId { get; set; }
    public string? ProfessorNome { get; set; }
    public Guid? PlanoId { get; set; }
    public string? PlanoNome { get; set; }
    public DateTime DataMatricula { get; set; }
    public StatusAluno Status { get; set; }
    public string? Observacoes { get; set; }
}

public class CreateAlunoDto
{
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? Telefone { get; set; }
    public Guid? ProfessorId { get; set; }
    public Guid? PlanoId { get; set; }
    public string? Observacoes { get; set; }
}

public class UpdateAlunoDto
{
    public string? Telefone { get; set; }
    public Guid? ProfessorId { get; set; }
    public Guid? PlanoId { get; set; }
    public StatusAluno? Status { get; set; }
    public string? Observacoes { get; set; }
}

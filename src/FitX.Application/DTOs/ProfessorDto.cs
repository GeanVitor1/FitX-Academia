namespace FitX.Application.DTOs;

public class ProfessorDto
{
    public Guid Id { get; set; }
    public Guid UsuarioId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Telefone { get; set; }
    public string? Especialidade { get; set; }
    public string? CREF { get; set; }
    public string? Bio { get; set; }
    public double? AvaliacaoMedia { get; set; }
    public int TotalAlunos { get; set; }
}

public class CreateProfessorDto
{
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? Telefone { get; set; }
    public string? Especialidade { get; set; }
    public string? CREF { get; set; }
    public string? Bio { get; set; }
}

public class UpdateProfessorDto
{
    public string? Telefone { get; set; }
    public string? Especialidade { get; set; }
    public string? CREF { get; set; }
    public string? Bio { get; set; }
}

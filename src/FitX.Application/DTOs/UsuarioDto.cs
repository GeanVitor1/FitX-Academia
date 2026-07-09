using FitX.Domain.Enums;

namespace FitX.Application.DTOs;

public class UsuarioDto
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public string? Avatar { get; set; }
    public string? Telefone { get; set; }
    public bool Ativo { get; set; }
    public DateTime CriadoEm { get; set; }
    public DateTime? UltimoLogin { get; set; }
}

public class UpdateUsuarioDto
{
    public string? Nome { get; set; }
    public string? Telefone { get; set; }
    public string? Avatar { get; set; }
    public bool? Ativo { get; set; }
}

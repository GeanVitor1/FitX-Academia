using FitX.Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace FitX.Domain.Entities;

public class Usuario : IdentityUser<Guid>, IEntity
{
    public string Nome { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public string? Avatar { get; set; }
    public string? Telefone { get; set; }
    public DateTime? UltimoLogin { get; set; }
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
    public DateTime? AtualizadoEm { get; set; }
    public bool Ativo { get; set; } = true;

    public Aluno? Aluno { get; set; }
    public Professor? Professor { get; set; }
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    public ICollection<Notificacao> Notificacoes { get; set; } = new List<Notificacao>();
}

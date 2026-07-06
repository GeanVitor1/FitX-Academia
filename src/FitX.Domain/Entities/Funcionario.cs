namespace FitX.Domain.Entities;

public class Funcionario : BaseEntity
{
    public Guid UsuarioId { get; set; }
    public string? Cargo { get; set; }
    public string? Setor { get; set; }
    public DateTime DataAdmissao { get; set; }
    public decimal? Salario { get; set; }

    public Usuario Usuario { get; set; } = null!;
}

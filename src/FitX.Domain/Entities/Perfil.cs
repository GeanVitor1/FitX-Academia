namespace FitX.Domain.Entities;

public class Perfil : BaseEntity
{
    public Guid UsuarioId { get; set; }
    public DateTime? DataNascimento { get; set; }
    public string? Sexo { get; set; }
    public double? Peso { get; set; }
    public double? Altura { get; set; }
    public string? Biometria { get; set; }
    public string? Endereco { get; set; }
    public string? Cidade { get; set; }
    public string? Estado { get; set; }
    public string? Cep { get; set; }

    public Usuario Usuario { get; set; } = null!;
}

namespace FitX.Domain.Entities;

public class RefreshToken : BaseEntity
{
    public Guid UsuarioId { get; set; }
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiraEm { get; set; }
    public DateTime? RevogadoEm { get; set; }
    public string? CriadoIp { get; set; }
    public string? RevogadoIp { get; set; }

    public Usuario Usuario { get; set; } = null!;

    public bool Expirado => DateTime.UtcNow >= ExpiraEm;
    public bool Revogado => RevogadoEm.HasValue;
    public bool EstaAtivo => !Expirado && !Revogado;
}

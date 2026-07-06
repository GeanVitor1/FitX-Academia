using FitX.Domain.Enums;

namespace FitX.Domain.Entities;

public class Log : BaseEntity
{
    public Guid? UsuarioId { get; set; }
    public TipoLog Tipo { get; set; }
    public string Acao { get; set; } = string.Empty;
    public string? Entidade { get; set; }
    public string? EntidadeId { get; set; }
    public string? Detalhes { get; set; }
    public string? Ip { get; set; }

    public Usuario? Usuario { get; set; }
}

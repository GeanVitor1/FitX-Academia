using FitX.Domain.Enums;

namespace FitX.Domain.Entities;

public class Historico : BaseEntity
{
    public Guid AlunoId { get; set; }
    public TipoHistorico Tipo { get; set; }
    public string? Valor { get; set; }
    public string? Observacao { get; set; }

    public Aluno Aluno { get; set; } = null!;
}

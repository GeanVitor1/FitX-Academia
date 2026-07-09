using FitX.Domain.Enums;

namespace FitX.Domain.Entities;

public class CheckinRequest : BaseEntity
{
    public Guid AlunoId { get; set; }
    public StatusCheckinRequest Status { get; set; }
    public DateTime? RespondidaEm { get; set; }
    public Guid? RespondidaPorId { get; set; }

    public Aluno Aluno { get; set; } = null!;
    public Usuario? RespondidaPor { get; set; }
}

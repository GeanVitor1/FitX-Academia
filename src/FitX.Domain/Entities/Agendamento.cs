using FitX.Domain.Enums;

namespace FitX.Domain.Entities;

public class Agendamento : BaseEntity
{
    public Guid AlunoId { get; set; }
    public Guid AulaId { get; set; }
    public DateTime Data { get; set; }
    public StatusAgendamento Status { get; set; }

    public Aluno Aluno { get; set; } = null!;
    public Aula Aula { get; set; } = null!;
}

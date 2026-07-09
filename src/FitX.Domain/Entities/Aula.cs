namespace FitX.Domain.Entities;

public class Aula : BaseEntity
{
    public string Nome { get; set; } = string.Empty;
    public Guid ProfessorId { get; set; }
    public TimeSpan Horario { get; set; }
    public string DiasSemana { get; set; } = string.Empty;
    public int Vagas { get; set; }
    public int VagasOcupadas { get; set; }
    public bool Ativa { get; set; } = true;
    public string? Descricao { get; set; }
    public string? ImagemUrl { get; set; }

    public Professor Professor { get; set; } = null!;
    public ICollection<Agendamento> Agendamentos { get; set; } = new List<Agendamento>();
}

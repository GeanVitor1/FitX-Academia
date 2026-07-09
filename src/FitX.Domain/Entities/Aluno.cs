using FitX.Domain.Enums;

namespace FitX.Domain.Entities;

public class Aluno : BaseEntity
{
    public Guid UsuarioId { get; set; }
    public Guid? ProfessorId { get; set; }
    public Guid? PlanoId { get; set; }
    public DateTime DataMatricula { get; set; }
    public StatusAluno Status { get; set; }
    public string? Observacoes { get; set; }

    public Usuario Usuario { get; set; } = null!;
    public Professor? Professor { get; set; }
    public Plano? Plano { get; set; }
    public ICollection<Treino> Treinos { get; set; } = new List<Treino>();
    public ICollection<Avaliacao> Avaliacoes { get; set; } = new List<Avaliacao>();
    public ICollection<Mensalidade> Mensalidades { get; set; } = new List<Mensalidade>();
    public ICollection<Checkin> Checkins { get; set; } = new List<Checkin>();
    public ICollection<Agendamento> Agendamentos { get; set; } = new List<Agendamento>();
}

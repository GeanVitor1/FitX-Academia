namespace FitX.Domain.Entities;

public class Professor : BaseEntity
{
    public Guid UsuarioId { get; set; }
    public string? Especialidade { get; set; }
    public string? CREF { get; set; }
    public string? Bio { get; set; }
    public double? AvaliacaoMedia { get; set; }

    public Usuario Usuario { get; set; } = null!;
    public ICollection<Aluno> Alunos { get; set; } = new List<Aluno>();
    public ICollection<Treino> Treinos { get; set; } = new List<Treino>();
    public ICollection<Avaliacao> Avaliacoes { get; set; } = new List<Avaliacao>();
    public ICollection<Aula> Aulas { get; set; } = new List<Aula>();
}

namespace FitX.Domain.Entities;

public class Treino : BaseEntity
{
    public Guid AlunoId { get; set; }
    public Guid ProfessorId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public DateTime DataInicio { get; set; }
    public DateTime? DataFim { get; set; }
    public int DiaSemana { get; set; }

    public Aluno Aluno { get; set; } = null!;
    public Professor Professor { get; set; } = null!;
    public ICollection<Serie> Series { get; set; } = new List<Serie>();
}

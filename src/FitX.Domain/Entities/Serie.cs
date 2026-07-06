namespace FitX.Domain.Entities;

public class Serie : BaseEntity
{
    public Guid TreinoId { get; set; }
    public Guid ExercicioId { get; set; }
    public int Repeticoes { get; set; }
    public double? Carga { get; set; }
    public int DescansoSegundos { get; set; }
    public int Ordem { get; set; }
    public string? Observacao { get; set; }

    public Treino Treino { get; set; } = null!;
    public Exercicio Exercicio { get; set; } = null!;
}

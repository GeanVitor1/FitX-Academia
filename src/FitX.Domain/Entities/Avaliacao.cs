namespace FitX.Domain.Entities;

public class Avaliacao : BaseEntity
{
    public Guid AlunoId { get; set; }
    public Guid ProfessorId { get; set; }
    public DateTime Data { get; set; }
    public double Peso { get; set; }
    public double Altura { get; set; }
    public double IMC { get; set; }
    public double? PercentualGordura { get; set; }
    public double? MassaMuscular { get; set; }
    public double? CircunferenciaBracos { get; set; }
    public double? CircunferenciaPernas { get; set; }
    public double? CircunferenciaCintura { get; set; }
    public double? CircunferenciaAbdomen { get; set; }
    public string? Observacoes { get; set; }

    public Aluno Aluno { get; set; } = null!;
    public Professor Professor { get; set; } = null!;
}

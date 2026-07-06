namespace FitX.Application.DTOs;

public class AvaliacaoDto
{
    public Guid Id { get; set; }
    public Guid AlunoId { get; set; }
    public string AlunoNome { get; set; } = string.Empty;
    public Guid ProfessorId { get; set; }
    public string ProfessorNome { get; set; } = string.Empty;
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
}

public class CreateAvaliacaoDto
{
    public Guid AlunoId { get; set; }
    public double Peso { get; set; }
    public double Altura { get; set; }
    public double? PercentualGordura { get; set; }
    public double? MassaMuscular { get; set; }
    public double? CircunferenciaBracos { get; set; }
    public double? CircunferenciaPernas { get; set; }
    public double? CircunferenciaCintura { get; set; }
    public double? CircunferenciaAbdomen { get; set; }
    public string? Observacoes { get; set; }
}

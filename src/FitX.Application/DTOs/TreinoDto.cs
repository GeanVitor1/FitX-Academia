using FitX.Domain.Enums;

namespace FitX.Application.DTOs;

public class TreinoDto
{
    public Guid Id { get; set; }
    public Guid AlunoId { get; set; }
    public string AlunoNome { get; set; } = string.Empty;
    public Guid ProfessorId { get; set; }
    public string ProfessorNome { get; set; } = string.Empty;
    public string Nome { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public DateTime DataInicio { get; set; }
    public DateTime? DataFim { get; set; }
    public bool Ativo { get; set; }
    public int DiaSemana { get; set; }
    public int TotalSeries { get; set; }
}

public class CreateTreinoDto
{
    public Guid AlunoId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public DateTime DataInicio { get; set; }
    public int DiaSemana { get; set; }
}

public class UpdateTreinoDto
{
    public string? Nome { get; set; }
    public string? Descricao { get; set; }
    public DateTime? DataFim { get; set; }
    public bool? Ativo { get; set; }
    public int? DiaSemana { get; set; }
}

public class SerieDto
{
    public Guid Id { get; set; }
    public Guid ExercicioId { get; set; }
    public string ExercicioNome { get; set; } = string.Empty;
    public int Repeticoes { get; set; }
    public double? Carga { get; set; }
    public int DescansoSegundos { get; set; }
    public int Ordem { get; set; }
    public string? Observacao { get; set; }
}

public class CreateSerieDto
{
    public Guid ExercicioId { get; set; }
    public int Repeticoes { get; set; }
    public double? Carga { get; set; }
    public int DescansoSegundos { get; set; }
    public int Ordem { get; set; }
    public string? Observacao { get; set; }
}

public class ExercicioDto
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public GrupoMuscular GrupoMuscular { get; set; }
    public string? Descricao { get; set; }
    public string? VideoUrl { get; set; }
    public string? ImagemUrl { get; set; }
}

public class CreateExercicioDto
{
    public string Nome { get; set; } = string.Empty;
    public GrupoMuscular GrupoMuscular { get; set; }
    public string? Descricao { get; set; }
    public string? VideoUrl { get; set; }
    public string? ImagemUrl { get; set; }
}

public class UpdateExercicioDto
{
    public string? Nome { get; set; }
    public GrupoMuscular? GrupoMuscular { get; set; }
    public string? Descricao { get; set; }
    public string? VideoUrl { get; set; }
    public string? ImagemUrl { get; set; }
}

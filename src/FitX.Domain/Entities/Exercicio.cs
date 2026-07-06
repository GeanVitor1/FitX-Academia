using FitX.Domain.Enums;

namespace FitX.Domain.Entities;

public class Exercicio : BaseEntity
{
    public string Nome { get; set; } = string.Empty;
    public GrupoMuscular GrupoMuscular { get; set; }
    public string? Descricao { get; set; }
    public string? VideoUrl { get; set; }
    public string? ImagemUrl { get; set; }
    public string? Instrucoes { get; set; }

    public ICollection<Serie> Series { get; set; } = new List<Serie>();
}

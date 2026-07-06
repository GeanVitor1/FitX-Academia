namespace FitX.Application.DTOs;

public class PlanoDto
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public decimal Preco { get; set; }
    public string? Descricao { get; set; }
    public string? Recursos { get; set; }
    public int DuracaoDias { get; set; }
    public bool PermitePersonal { get; set; }
    public bool PermiteAulas { get; set; }
    public bool Ativo { get; set; }
    public int TotalAlunos { get; set; }
}

public class CreatePlanoDto
{
    public string Nome { get; set; } = string.Empty;
    public decimal Preco { get; set; }
    public string? Descricao { get; set; }
    public string? Recursos { get; set; }
    public int DuracaoDias { get; set; }
    public bool PermitePersonal { get; set; }
    public bool PermiteAulas { get; set; }
}

public class UpdatePlanoDto
{
    public string? Nome { get; set; }
    public decimal? Preco { get; set; }
    public string? Descricao { get; set; }
    public string? Recursos { get; set; }
    public int? DuracaoDias { get; set; }
    public bool? PermitePersonal { get; set; }
    public bool? PermiteAulas { get; set; }
    public bool? Ativo { get; set; }
}

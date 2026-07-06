namespace FitX.Domain.Entities;

public class Plano : BaseEntity
{
    public string Nome { get; set; } = string.Empty;
    public decimal Preco { get; set; }
    public string? Descricao { get; set; }
    public string? Recursos { get; set; }
    public int DuracaoDias { get; set; }
    public bool PermitePersonal { get; set; }
    public bool PermiteAulas { get; set; }
    public int Ordem { get; set; }

    public ICollection<Aluno> Alunos { get; set; } = new List<Aluno>();
    public ICollection<Mensalidade> Mensalidades { get; set; } = new List<Mensalidade>();
}

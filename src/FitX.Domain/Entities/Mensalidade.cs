using FitX.Domain.Enums;

namespace FitX.Domain.Entities;

public class Mensalidade : BaseEntity
{
    public Guid AlunoId { get; set; }
    public Guid PlanoId { get; set; }
    public decimal Valor { get; set; }
    public DateTime DataVencimento { get; set; }
    public DateTime? PagoEm { get; set; }
    public StatusMensalidade Status { get; set; }
    public string? Observacao { get; set; }

    public Aluno Aluno { get; set; } = null!;
    public Plano Plano { get; set; } = null!;
    public ICollection<Pagamento> Pagamentos { get; set; } = new List<Pagamento>();
}

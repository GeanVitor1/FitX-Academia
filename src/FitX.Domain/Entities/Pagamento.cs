using FitX.Domain.Enums;

namespace FitX.Domain.Entities;

public class Pagamento : BaseEntity
{
    public Guid MensalidadeId { get; set; }
    public MetodoPagamento Metodo { get; set; }
    public decimal Valor { get; set; }
    public DateTime Data { get; set; }
    public string? Comprovante { get; set; }
    public StatusPagamento Status { get; set; }
    public string? TransacaoId { get; set; }

    public Mensalidade Mensalidade { get; set; } = null!;
}

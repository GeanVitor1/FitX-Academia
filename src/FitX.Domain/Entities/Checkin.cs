using FitX.Domain.Enums;

namespace FitX.Domain.Entities;

public class Checkin : BaseEntity
{
    public Guid AlunoId { get; set; }
    public DateTime DataEntrada { get; set; }
    public DateTime? DataSaida { get; set; }
    public string? QRCode { get; set; }
    public StatusCheckin Status { get; set; }

    public Aluno Aluno { get; set; } = null!;
}

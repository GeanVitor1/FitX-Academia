using FitX.Domain.Enums;

namespace FitX.Domain.Entities;

public class Equipamento : BaseEntity
{
    public string Nome { get; set; } = string.Empty;
    public string Categoria { get; set; } = string.Empty;
    public string? Localizacao { get; set; }
    public EquipamentoStatus Status { get; set; }
    public string? UltimaManutencao { get; set; }
}

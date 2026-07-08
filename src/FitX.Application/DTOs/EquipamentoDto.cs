using FitX.Domain.Enums;

namespace FitX.Application.DTOs;

public class EquipamentoDto
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Categoria { get; set; } = string.Empty;
    public string? Localizacao { get; set; }
    public EquipamentoStatus Status { get; set; }
    public string? UltimaManutencao { get; set; }
    public bool Ativo { get; set; }
}

public class CreateEquipamentoDto
{
    public string Nome { get; set; } = string.Empty;
    public string Categoria { get; set; } = string.Empty;
    public string? Localizacao { get; set; }
    public EquipamentoStatus Status { get; set; }
    public string? UltimaManutencao { get; set; }
}

public class UpdateEquipamentoDto
{
    public string? Nome { get; set; }
    public string? Categoria { get; set; }
    public string? Localizacao { get; set; }
    public EquipamentoStatus? Status { get; set; }
    public string? UltimaManutencao { get; set; }
    public bool? Ativo { get; set; }
}

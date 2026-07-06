namespace FitX.Domain.Entities;

public interface IEntity
{
    Guid Id { get; set; }
    DateTime CriadoEm { get; set; }
    DateTime? AtualizadoEm { get; set; }
    bool Ativo { get; set; }
}

namespace FitX.Domain.Entities;

public abstract class BaseEntity : IEntity
{
    public Guid Id { get; set; }
    public DateTime CriadoEm { get; set; }
    public DateTime? AtualizadoEm { get; set; }
    public bool Ativo { get; set; } = true;

    protected BaseEntity()
    {
        Id = Guid.NewGuid();
        CriadoEm = DateTime.UtcNow;
        Ativo = true;
    }
}

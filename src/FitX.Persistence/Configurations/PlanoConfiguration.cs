using FitX.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FitX.Persistence.Configurations;

public class PlanoConfiguration : IEntityTypeConfiguration<Plano>
{
    public void Configure(EntityTypeBuilder<Plano> builder)
    {
        builder.ToTable("Planos");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Nome)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(p => p.Preco)
            .IsRequired()
            .HasPrecision(10, 2);

        builder.Property(p => p.Descricao)
            .HasMaxLength(500);

        builder.Property(p => p.Recursos)
            .HasMaxLength(1000);

        builder.HasIndex(p => p.Nome)
            .IsUnique();

        builder.HasIndex(p => p.Ativo);
    }
}

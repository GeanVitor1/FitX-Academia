using FitX.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FitX.Persistence.Configurations;

public class EquipamentoConfiguration : IEntityTypeConfiguration<Equipamento>
{
    public void Configure(EntityTypeBuilder<Equipamento> builder)
    {
        builder.ToTable("Equipamentos");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Nome)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(e => e.Categoria)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(e => e.Localizacao)
            .HasMaxLength(200);

        builder.Property(e => e.UltimaManutencao)
            .HasMaxLength(100);

        builder.HasIndex(e => e.Nome);
        builder.HasIndex(e => e.Categoria);
        builder.HasIndex(e => e.Status);
    }
}

using FitX.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FitX.Persistence.Configurations;

public class ExercicioConfiguration : IEntityTypeConfiguration<Exercicio>
{
    public void Configure(EntityTypeBuilder<Exercicio> builder)
    {
        builder.ToTable("Exercicios");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Nome)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(e => e.GrupoMuscular)
            .IsRequired();

        builder.Property(e => e.Descricao)
            .HasMaxLength(1000);

        builder.Property(e => e.VideoUrl)
            .HasMaxLength(500);

        builder.Property(e => e.ImagemUrl)
            .HasMaxLength(500);

        builder.Property(e => e.Instrucoes)
            .HasMaxLength(2000);

        builder.HasIndex(e => e.GrupoMuscular);
    }
}

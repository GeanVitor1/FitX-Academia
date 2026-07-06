using FitX.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FitX.Persistence.Configurations;

public class SerieConfiguration : IEntityTypeConfiguration<Serie>
{
    public void Configure(EntityTypeBuilder<Serie> builder)
    {
        builder.ToTable("Series");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.Carga)
            .HasPrecision(6, 2);

        builder.Property(s => s.Observacao)
            .HasMaxLength(500);

        builder.HasOne(s => s.Treino)
            .WithMany(t => t.Series)
            .HasForeignKey(s => s.TreinoId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(s => s.Exercicio)
            .WithMany(e => e.Series)
            .HasForeignKey(s => s.ExercicioId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(s => s.TreinoId);
        builder.HasIndex(s => s.ExercicioId);
    }
}

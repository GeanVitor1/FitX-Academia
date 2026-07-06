using FitX.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FitX.Persistence.Configurations;

public class AvaliacaoConfiguration : IEntityTypeConfiguration<Avaliacao>
{
    public void Configure(EntityTypeBuilder<Avaliacao> builder)
    {
        builder.ToTable("Avaliacoes");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.Peso)
            .HasPrecision(6, 2);

        builder.Property(a => a.Altura)
            .HasPrecision(4, 2);

        builder.Property(a => a.IMC)
            .HasPrecision(6, 2);

        builder.Property(a => a.PercentualGordura)
            .HasPrecision(5, 2);

        builder.Property(a => a.MassaMuscular)
            .HasPrecision(5, 2);

        builder.Property(a => a.CircunferenciaBracos)
            .HasPrecision(6, 2);

        builder.Property(a => a.CircunferenciaPernas)
            .HasPrecision(6, 2);

        builder.Property(a => a.CircunferenciaCintura)
            .HasPrecision(6, 2);

        builder.Property(a => a.CircunferenciaAbdomen)
            .HasPrecision(6, 2);

        builder.Property(a => a.Observacoes)
            .HasMaxLength(2000);

        builder.HasOne(a => a.Aluno)
            .WithMany(al => al.Avaliacoes)
            .HasForeignKey(a => a.AlunoId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(a => a.Professor)
            .WithMany(p => p.Avaliacoes)
            .HasForeignKey(a => a.ProfessorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(a => a.AlunoId);
        builder.HasIndex(a => a.ProfessorId);
        builder.HasIndex(a => a.Data);
    }
}

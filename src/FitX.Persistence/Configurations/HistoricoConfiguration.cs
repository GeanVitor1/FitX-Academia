using FitX.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FitX.Persistence.Configurations;

public class HistoricoConfiguration : IEntityTypeConfiguration<Historico>
{
    public void Configure(EntityTypeBuilder<Historico> builder)
    {
        builder.ToTable("Historicos");

        builder.HasKey(h => h.Id);

        builder.Property(h => h.Valor)
            .HasMaxLength(500);

        builder.Property(h => h.Observacao)
            .HasMaxLength(1000);

        builder.HasOne(h => h.Aluno)
            .WithMany(a => a.Historicos)
            .HasForeignKey(h => h.AlunoId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(h => h.AlunoId);
        builder.HasIndex(h => h.Tipo);
    }
}

using FitX.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FitX.Persistence.Configurations;

public class MensalidadeConfiguration : IEntityTypeConfiguration<Mensalidade>
{
    public void Configure(EntityTypeBuilder<Mensalidade> builder)
    {
        builder.ToTable("Mensalidades");

        builder.HasKey(m => m.Id);

        builder.Property(m => m.Valor)
            .IsRequired()
            .HasPrecision(10, 2);

        builder.Property(m => m.Observacao)
            .HasMaxLength(500);

        builder.HasOne(m => m.Aluno)
            .WithMany(a => a.Mensalidades)
            .HasForeignKey(m => m.AlunoId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(m => m.Plano)
            .WithMany(p => p.Mensalidades)
            .HasForeignKey(m => m.PlanoId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(m => m.AlunoId);
        builder.HasIndex(m => m.PlanoId);
        builder.HasIndex(m => m.Status);
        builder.HasIndex(m => m.DataVencimento);
    }
}

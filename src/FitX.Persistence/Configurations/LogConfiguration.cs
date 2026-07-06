using FitX.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FitX.Persistence.Configurations;

public class LogConfiguration : IEntityTypeConfiguration<Log>
{
    public void Configure(EntityTypeBuilder<Log> builder)
    {
        builder.ToTable("Logs");

        builder.HasKey(l => l.Id);

        builder.Property(l => l.Acao)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(l => l.Entidade)
            .HasMaxLength(100);

        builder.Property(l => l.EntidadeId)
            .HasMaxLength(100);

        builder.Property(l => l.Detalhes)
            .HasMaxLength(4000);

        builder.Property(l => l.Ip)
            .HasMaxLength(50);

        builder.HasOne(l => l.Usuario)
            .WithMany(u => u.Logs)
            .HasForeignKey(l => l.UsuarioId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(l => l.UsuarioId);
        builder.HasIndex(l => l.Tipo);
        builder.HasIndex(l => l.CriadoEm);
    }
}

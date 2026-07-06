using FitX.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FitX.Persistence.Configurations;

public class PagamentoConfiguration : IEntityTypeConfiguration<Pagamento>
{
    public void Configure(EntityTypeBuilder<Pagamento> builder)
    {
        builder.ToTable("Pagamentos");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Valor)
            .IsRequired()
            .HasPrecision(10, 2);

        builder.Property(p => p.Comprovante)
            .HasMaxLength(500);

        builder.Property(p => p.TransacaoId)
            .HasMaxLength(200);

        builder.HasOne(p => p.Mensalidade)
            .WithMany(m => m.Pagamentos)
            .HasForeignKey(p => p.MensalidadeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(p => p.MensalidadeId);
        builder.HasIndex(p => p.Status);
        builder.HasIndex(p => p.Data);
    }
}

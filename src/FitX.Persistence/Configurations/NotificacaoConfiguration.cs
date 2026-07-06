using FitX.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FitX.Persistence.Configurations;

public class NotificacaoConfiguration : IEntityTypeConfiguration<Notificacao>
{
    public void Configure(EntityTypeBuilder<Notificacao> builder)
    {
        builder.ToTable("Notificacoes");

        builder.HasKey(n => n.Id);

        builder.Property(n => n.Titulo)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(n => n.Mensagem)
            .IsRequired()
            .HasMaxLength(2000);

        builder.Property(n => n.Link)
            .HasMaxLength(500);

        builder.HasOne(n => n.Usuario)
            .WithMany(u => u.Notificacoes)
            .HasForeignKey(n => n.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(n => n.UsuarioId);
        builder.HasIndex(n => n.Lida);
    }
}

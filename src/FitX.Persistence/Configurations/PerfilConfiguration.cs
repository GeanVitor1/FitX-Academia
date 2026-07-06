using FitX.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FitX.Persistence.Configurations;

public class PerfilConfiguration : IEntityTypeConfiguration<Perfil>
{
    public void Configure(EntityTypeBuilder<Perfil> builder)
    {
        builder.ToTable("Perfis");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Sexo)
            .HasMaxLength(20);

        builder.Property(p => p.Biometria)
            .HasMaxLength(200);

        builder.Property(p => p.Endereco)
            .HasMaxLength(300);

        builder.Property(p => p.Cidade)
            .HasMaxLength(100);

        builder.Property(p => p.Estado)
            .HasMaxLength(2);

        builder.Property(p => p.Cep)
            .HasMaxLength(10);

        builder.HasOne(p => p.Usuario)
            .WithOne(u => u.Perfil)
            .HasForeignKey<Perfil>(p => p.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(p => p.UsuarioId)
            .IsUnique();
    }
}

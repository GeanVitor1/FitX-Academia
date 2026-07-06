using FitX.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FitX.Persistence.Configurations;

public class ProfessorConfiguration : IEntityTypeConfiguration<Professor>
{
    public void Configure(EntityTypeBuilder<Professor> builder)
    {
        builder.ToTable("Professores");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Especialidade)
            .HasMaxLength(200);

        builder.Property(p => p.CREF)
            .HasMaxLength(20);

        builder.Property(p => p.Bio)
            .HasMaxLength(1000);

        builder.HasOne(p => p.Usuario)
            .WithOne(u => u.Professor)
            .HasForeignKey<Professor>(p => p.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(p => p.UsuarioId)
            .IsUnique();

        builder.HasIndex(p => p.CREF)
            .IsUnique()
            .HasFilter("[CREF] IS NOT NULL");
    }
}

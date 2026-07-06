using FitX.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FitX.Persistence.Configurations;

public class AlunoConfiguration : IEntityTypeConfiguration<Aluno>
{
    public void Configure(EntityTypeBuilder<Aluno> builder)
    {
        builder.ToTable("Alunos");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.Observacoes)
            .HasMaxLength(1000);

        builder.HasOne(a => a.Usuario)
            .WithOne(u => u.Aluno)
            .HasForeignKey<Aluno>(a => a.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(a => a.Professor)
            .WithMany(p => p.Alunos)
            .HasForeignKey(a => a.ProfessorId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(a => a.Plano)
            .WithMany(p => p.Alunos)
            .HasForeignKey(a => a.PlanoId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(a => a.UsuarioId)
            .IsUnique();

        builder.HasIndex(a => a.ProfessorId);
        builder.HasIndex(a => a.PlanoId);
        builder.HasIndex(a => a.Status);
    }
}

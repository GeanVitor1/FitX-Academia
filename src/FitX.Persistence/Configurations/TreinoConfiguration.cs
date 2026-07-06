using FitX.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FitX.Persistence.Configurations;

public class TreinoConfiguration : IEntityTypeConfiguration<Treino>
{
    public void Configure(EntityTypeBuilder<Treino> builder)
    {
        builder.ToTable("Treinos");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Nome)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(t => t.Descricao)
            .HasMaxLength(1000);

        builder.HasOne(t => t.Aluno)
            .WithMany(a => a.Treinos)
            .HasForeignKey(t => t.AlunoId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(t => t.Professor)
            .WithMany(p => p.Treinos)
            .HasForeignKey(t => t.ProfessorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(t => t.AlunoId);
        builder.HasIndex(t => t.ProfessorId);
        builder.HasIndex(t => t.Ativo);
    }
}

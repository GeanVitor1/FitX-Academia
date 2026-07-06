using FitX.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FitX.Persistence.Configurations;

public class AulaConfiguration : IEntityTypeConfiguration<Aula>
{
    public void Configure(EntityTypeBuilder<Aula> builder)
    {
        builder.ToTable("Aulas");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.Nome)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(a => a.DiasSemana)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(a => a.Descricao)
            .HasMaxLength(1000);

        builder.Property(a => a.ImagemUrl)
            .HasMaxLength(500);

        builder.HasOne(a => a.Professor)
            .WithMany(p => p.Aulas)
            .HasForeignKey(a => a.ProfessorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(a => a.ProfessorId);
        builder.HasIndex(a => a.Ativa);
    }
}

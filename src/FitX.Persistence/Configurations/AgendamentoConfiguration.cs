using FitX.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FitX.Persistence.Configurations;

public class AgendamentoConfiguration : IEntityTypeConfiguration<Agendamento>
{
    public void Configure(EntityTypeBuilder<Agendamento> builder)
    {
        builder.ToTable("Agendamentos");

        builder.HasKey(a => a.Id);

        builder.HasOne(a => a.Aluno)
            .WithMany(al => al.Agendamentos)
            .HasForeignKey(a => a.AlunoId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(a => a.Aula)
            .WithMany(au => au.Agendamentos)
            .HasForeignKey(a => a.AulaId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(a => a.AlunoId);
        builder.HasIndex(a => a.AulaId);
        builder.HasIndex(a => a.Status);
        builder.HasIndex(a => a.Data);
    }
}

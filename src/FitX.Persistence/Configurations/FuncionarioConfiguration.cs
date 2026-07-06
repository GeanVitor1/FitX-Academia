using FitX.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FitX.Persistence.Configurations;

public class FuncionarioConfiguration : IEntityTypeConfiguration<Funcionario>
{
    public void Configure(EntityTypeBuilder<Funcionario> builder)
    {
        builder.ToTable("Funcionarios");

        builder.HasKey(f => f.Id);

        builder.Property(f => f.Cargo)
            .HasMaxLength(100);

        builder.Property(f => f.Setor)
            .HasMaxLength(100);

        builder.Property(f => f.Salario)
            .HasPrecision(10, 2);

        builder.HasOne(f => f.Usuario)
            .WithOne(u => u.Funcionario)
            .HasForeignKey<Funcionario>(f => f.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(f => f.UsuarioId)
            .IsUnique();
    }
}

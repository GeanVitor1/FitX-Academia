using FitX.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FitX.Persistence.Configurations;

public class CheckinConfiguration : IEntityTypeConfiguration<Checkin>
{
    public void Configure(EntityTypeBuilder<Checkin> builder)
    {
        builder.ToTable("Checkins");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.QRCode)
            .HasMaxLength(200);

        builder.HasOne(c => c.Aluno)
            .WithMany(a => a.Checkins)
            .HasForeignKey(c => c.AlunoId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(c => c.AlunoId);
        builder.HasIndex(c => c.Status);
        builder.HasIndex(c => c.DataEntrada);
    }
}

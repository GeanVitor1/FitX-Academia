using FitX.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FitX.Persistence.Configurations;

public class CheckinRequestConfiguration : IEntityTypeConfiguration<CheckinRequest>
{
    public void Configure(EntityTypeBuilder<CheckinRequest> builder)
    {
        builder.ToTable("CheckinRequests");

        builder.HasKey(r => r.Id);

        builder.HasOne(r => r.Aluno)
            .WithMany()
            .HasForeignKey(r => r.AlunoId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(r => r.RespondidaPor)
            .WithMany()
            .HasForeignKey(r => r.RespondidaPorId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(r => r.AlunoId);
        builder.HasIndex(r => r.Status);
        builder.HasIndex(r => r.CriadoEm);
    }
}

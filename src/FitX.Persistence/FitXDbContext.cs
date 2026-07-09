using FitX.Domain.Entities;
using FitX.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FitX.Persistence;

public class FitXDbContext : IdentityDbContext<Usuario, IdentityRole<Guid>, Guid>
{
    public FitXDbContext(DbContextOptions<FitXDbContext> options) : base(options)
    {
    }

    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Aluno> Alunos => Set<Aluno>();
    public DbSet<Professor> Professores => Set<Professor>();
    public DbSet<Plano> Planos => Set<Plano>();
    public DbSet<Treino> Treinos => Set<Treino>();
    public DbSet<Exercicio> Exercicios => Set<Exercicio>();
    public DbSet<Serie> Series => Set<Serie>();
    public DbSet<Avaliacao> Avaliacoes => Set<Avaliacao>();
    public DbSet<Mensalidade> Mensalidades => Set<Mensalidade>();
    public DbSet<Pagamento> Pagamentos => Set<Pagamento>();
    public DbSet<Checkin> Checkins => Set<Checkin>();
    public DbSet<CheckinRequest> CheckinRequests => Set<CheckinRequest>();
    public DbSet<Aula> Aulas => Set<Aula>();
    public DbSet<Agendamento> Agendamentos => Set<Agendamento>();
    public DbSet<Notificacao> Notificacoes => Set<Notificacao>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Equipamento> Equipamentos => Set<Equipamento>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(FitXDbContext).Assembly);

        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        var seedDate = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        var planoBasicoId = new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567810");
        var planoCompletoId = new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567811");
        var planoPremiumId = new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567812");

        var exercicio1Id = new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567820");
        var exercicio2Id = new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567821");
        var exercicio3Id = new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567822");
        var exercicio4Id = new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567823");
        var exercicio5Id = new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567824");
        var exercicio6Id = new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567825");
        var exercicio7Id = new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567826");
        var exercicio8Id = new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567827");
        var exercicio9Id = new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567828");
        var exercicio10Id = new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567829");

        modelBuilder.Entity<Plano>().HasData(
            new Plano
            {
                Id = planoBasicoId,
                Nome = "Básico",
                Preco = 89.90m,
                Descricao = "Comece sua transformação",
                Recursos = "Musculação,Avaliação física,Treinos livres,Suporte básico",
                DuracaoDias = 30,
                PermitePersonal = false,
                PermiteAulas = false,
                Ordem = 1,
                Ativo = true,
                CriadoEm = seedDate
            },
            new Plano
            {
                Id = planoCompletoId,
                Nome = "Completo",
                Preco = 129.90m,
                Descricao = "Resultados mais rápidos e completos",
                Recursos = "Musculação,Avaliação física,Aulas coletivas,Treinos personalizados,Suporte prioritário",
                DuracaoDias = 30,
                PermitePersonal = true,
                PermiteAulas = true,
                Ordem = 2,
                Ativo = true,
                CriadoEm = seedDate
            },
            new Plano
            {
                Id = planoPremiumId,
                Nome = "Premium",
                Preco = 199.90m,
                Descricao = "Experiência sem limites",
                Recursos = "Tudo do Completo,Consultoria exclusiva,Check-ups mensais,App personalizado,Acesso total",
                DuracaoDias = 30,
                PermitePersonal = true,
                PermiteAulas = true,
                Ordem = 3,
                Ativo = true,
                CriadoEm = seedDate
            }
        );

        modelBuilder.Entity<Exercicio>().HasData(
            new Exercicio { Id = exercicio1Id, Nome = "Supino Reto", GrupoMuscular = GrupoMuscular.Peito, Descricao = "Exercício para peito com barra", Ativo = true, CriadoEm = seedDate },
            new Exercicio { Id = exercicio2Id, Nome = "Agachamento", GrupoMuscular = GrupoMuscular.Quadriceps, Descricao = "Exercício para pernas com barra", Ativo = true, CriadoEm = seedDate },
            new Exercicio { Id = exercicio3Id, Nome = "Puxada Frontal", GrupoMuscular = GrupoMuscular.Costas, Descricao = "Exercício para costas na polia", Ativo = true, CriadoEm = seedDate },
            new Exercicio { Id = exercicio4Id, Nome = "Desenvolvimento", GrupoMuscular = GrupoMuscular.Ombros, Descricao = "Exercício para ombros com halteres", Ativo = true, CriadoEm = seedDate },
            new Exercicio { Id = exercicio5Id, Nome = "Rosca Direta", GrupoMuscular = GrupoMuscular.Biceps, Descricao = "Exercício para bíceps com barra", Ativo = true, CriadoEm = seedDate },
            new Exercicio { Id = exercicio6Id, Nome = "Tríceps Pulley", GrupoMuscular = GrupoMuscular.Triceps, Descricao = "Exercício para tríceps na polia", Ativo = true, CriadoEm = seedDate },
            new Exercicio { Id = exercicio7Id, Nome = "Leg Press", GrupoMuscular = GrupoMuscular.Quadriceps, Descricao = "Exercício para pernas na máquina", Ativo = true, CriadoEm = seedDate },
            new Exercicio { Id = exercicio8Id, Nome = "Cadeira Extensora", GrupoMuscular = GrupoMuscular.Quadriceps, Descricao = "Exercício para quadríceps", Ativo = true, CriadoEm = seedDate },
            new Exercicio { Id = exercicio9Id, Nome = "Cadeira Flexora", GrupoMuscular = GrupoMuscular.Posterior, Descricao = "Exercício para posterior de coxa", Ativo = true, CriadoEm = seedDate },
            new Exercicio { Id = exercicio10Id, Nome = "Abdominal Crunch", GrupoMuscular = GrupoMuscular.Abdomen, Descricao = "Exercício para abdômen", Ativo = true, CriadoEm = seedDate }
        );
    }
}

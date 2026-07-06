using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FitX.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Exercicios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Nome = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    GrupoMuscular = table.Column<int>(type: "INTEGER", nullable: false),
                    Descricao = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true),
                    VideoUrl = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    ImagemUrl = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    Instrucoes = table.Column<string>(type: "TEXT", maxLength: 2000, nullable: true),
                    CriadoEm = table.Column<DateTime>(type: "TEXT", nullable: false),
                    AtualizadoEm = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Ativo = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Exercicios", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Planos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Nome = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Preco = table.Column<decimal>(type: "TEXT", precision: 10, scale: 2, nullable: false),
                    Descricao = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    Recursos = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true),
                    DuracaoDias = table.Column<int>(type: "INTEGER", nullable: false),
                    PermitePersonal = table.Column<bool>(type: "INTEGER", nullable: false),
                    PermiteAulas = table.Column<bool>(type: "INTEGER", nullable: false),
                    Ordem = table.Column<int>(type: "INTEGER", nullable: false),
                    CriadoEm = table.Column<DateTime>(type: "TEXT", nullable: false),
                    AtualizadoEm = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Ativo = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Planos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Nome = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Role = table.Column<int>(type: "INTEGER", nullable: false),
                    Avatar = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    Telefone = table.Column<string>(type: "TEXT", maxLength: 20, nullable: true),
                    UltimoLogin = table.Column<DateTime>(type: "TEXT", nullable: true),
                    CriadoEm = table.Column<DateTime>(type: "TEXT", nullable: false),
                    AtualizadoEm = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Ativo = table.Column<bool>(type: "INTEGER", nullable: false),
                    UserName = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    NormalizedEmail = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "INTEGER", nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: false),
                    SecurityStamp = table.Column<string>(type: "TEXT", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "TEXT", nullable: true),
                    PhoneNumber = table.Column<string>(type: "TEXT", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "INTEGER", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "INTEGER", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "INTEGER", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    RoleId = table.Column<Guid>(type: "TEXT", nullable: false),
                    ClaimType = table.Column<string>(type: "TEXT", nullable: true),
                    ClaimValue = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    ClaimType = table.Column<string>(type: "TEXT", nullable: true),
                    ClaimValue = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_Usuarios_UserId",
                        column: x => x.UserId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "TEXT", nullable: false),
                    ProviderKey = table.Column<string>(type: "TEXT", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "TEXT", nullable: true),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_Usuarios_UserId",
                        column: x => x.UserId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    RoleId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_Usuarios_UserId",
                        column: x => x.UserId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    LoginProvider = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Value = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_Usuarios_UserId",
                        column: x => x.UserId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Funcionarios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UsuarioId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Cargo = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    Setor = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    DataAdmissao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Salario = table.Column<decimal>(type: "TEXT", precision: 10, scale: 2, nullable: true),
                    CriadoEm = table.Column<DateTime>(type: "TEXT", nullable: false),
                    AtualizadoEm = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Ativo = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Funcionarios", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Funcionarios_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Logs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UsuarioId = table.Column<Guid>(type: "TEXT", nullable: true),
                    Tipo = table.Column<int>(type: "INTEGER", nullable: false),
                    Acao = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Entidade = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    EntidadeId = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    Detalhes = table.Column<string>(type: "TEXT", maxLength: 4000, nullable: true),
                    Ip = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    CriadoEm = table.Column<DateTime>(type: "TEXT", nullable: false),
                    AtualizadoEm = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Ativo = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Logs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Logs_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Notificacoes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UsuarioId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Titulo = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Mensagem = table.Column<string>(type: "TEXT", maxLength: 2000, nullable: false),
                    Lida = table.Column<bool>(type: "INTEGER", nullable: false),
                    Link = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    CriadoEm = table.Column<DateTime>(type: "TEXT", nullable: false),
                    AtualizadoEm = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Ativo = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notificacoes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Notificacoes_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Perfis",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UsuarioId = table.Column<Guid>(type: "TEXT", nullable: false),
                    DataNascimento = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Sexo = table.Column<string>(type: "TEXT", maxLength: 20, nullable: true),
                    Peso = table.Column<double>(type: "REAL", nullable: true),
                    Altura = table.Column<double>(type: "REAL", nullable: true),
                    Biometria = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    Endereco = table.Column<string>(type: "TEXT", maxLength: 300, nullable: true),
                    Cidade = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    Estado = table.Column<string>(type: "TEXT", maxLength: 2, nullable: true),
                    Cep = table.Column<string>(type: "TEXT", maxLength: 10, nullable: true),
                    CriadoEm = table.Column<DateTime>(type: "TEXT", nullable: false),
                    AtualizadoEm = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Ativo = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Perfis", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Perfis_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Professores",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UsuarioId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Especialidade = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    CREF = table.Column<string>(type: "TEXT", maxLength: 20, nullable: true),
                    Bio = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true),
                    AvaliacaoMedia = table.Column<double>(type: "REAL", nullable: true),
                    CriadoEm = table.Column<DateTime>(type: "TEXT", nullable: false),
                    AtualizadoEm = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Ativo = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Professores", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Professores_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RefreshTokens",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UsuarioId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Token = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    ExpiraEm = table.Column<DateTime>(type: "TEXT", nullable: false),
                    RevogadoEm = table.Column<DateTime>(type: "TEXT", nullable: true),
                    CriadoIp = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    RevogadoIp = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    CriadoEm = table.Column<DateTime>(type: "TEXT", nullable: false),
                    AtualizadoEm = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Ativo = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefreshTokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RefreshTokens_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Alunos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UsuarioId = table.Column<Guid>(type: "TEXT", nullable: false),
                    ProfessorId = table.Column<Guid>(type: "TEXT", nullable: true),
                    PlanoId = table.Column<Guid>(type: "TEXT", nullable: true),
                    DataMatricula = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Status = table.Column<int>(type: "INTEGER", nullable: false),
                    Observacoes = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true),
                    CriadoEm = table.Column<DateTime>(type: "TEXT", nullable: false),
                    AtualizadoEm = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Ativo = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Alunos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Alunos_Planos_PlanoId",
                        column: x => x.PlanoId,
                        principalTable: "Planos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Alunos_Professores_ProfessorId",
                        column: x => x.ProfessorId,
                        principalTable: "Professores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Alunos_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Aulas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Nome = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    ProfessorId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Horario = table.Column<TimeSpan>(type: "TEXT", nullable: false),
                    DiasSemana = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Vagas = table.Column<int>(type: "INTEGER", nullable: false),
                    VagasOcupadas = table.Column<int>(type: "INTEGER", nullable: false),
                    Ativa = table.Column<bool>(type: "INTEGER", nullable: false),
                    Descricao = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true),
                    ImagemUrl = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    CriadoEm = table.Column<DateTime>(type: "TEXT", nullable: false),
                    AtualizadoEm = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Ativo = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Aulas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Aulas_Professores_ProfessorId",
                        column: x => x.ProfessorId,
                        principalTable: "Professores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Avaliacoes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    AlunoId = table.Column<Guid>(type: "TEXT", nullable: false),
                    ProfessorId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Data = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Peso = table.Column<double>(type: "REAL", precision: 6, scale: 2, nullable: false),
                    Altura = table.Column<double>(type: "REAL", precision: 4, scale: 2, nullable: false),
                    IMC = table.Column<double>(type: "REAL", precision: 6, scale: 2, nullable: false),
                    PercentualGordura = table.Column<double>(type: "REAL", precision: 5, scale: 2, nullable: true),
                    MassaMuscular = table.Column<double>(type: "REAL", precision: 5, scale: 2, nullable: true),
                    CircunferenciaBracos = table.Column<double>(type: "REAL", precision: 6, scale: 2, nullable: true),
                    CircunferenciaPernas = table.Column<double>(type: "REAL", precision: 6, scale: 2, nullable: true),
                    CircunferenciaCintura = table.Column<double>(type: "REAL", precision: 6, scale: 2, nullable: true),
                    CircunferenciaAbdomen = table.Column<double>(type: "REAL", precision: 6, scale: 2, nullable: true),
                    Observacoes = table.Column<string>(type: "TEXT", maxLength: 2000, nullable: true),
                    CriadoEm = table.Column<DateTime>(type: "TEXT", nullable: false),
                    AtualizadoEm = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Ativo = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Avaliacoes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Avaliacoes_Alunos_AlunoId",
                        column: x => x.AlunoId,
                        principalTable: "Alunos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Avaliacoes_Professores_ProfessorId",
                        column: x => x.ProfessorId,
                        principalTable: "Professores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Checkins",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    AlunoId = table.Column<Guid>(type: "TEXT", nullable: false),
                    DataEntrada = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DataSaida = table.Column<DateTime>(type: "TEXT", nullable: true),
                    QRCode = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    Status = table.Column<int>(type: "INTEGER", nullable: false),
                    CriadoEm = table.Column<DateTime>(type: "TEXT", nullable: false),
                    AtualizadoEm = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Ativo = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Checkins", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Checkins_Alunos_AlunoId",
                        column: x => x.AlunoId,
                        principalTable: "Alunos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Historicos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    AlunoId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Tipo = table.Column<int>(type: "INTEGER", nullable: false),
                    Valor = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    Observacao = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true),
                    CriadoEm = table.Column<DateTime>(type: "TEXT", nullable: false),
                    AtualizadoEm = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Ativo = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Historicos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Historicos_Alunos_AlunoId",
                        column: x => x.AlunoId,
                        principalTable: "Alunos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Mensalidades",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    AlunoId = table.Column<Guid>(type: "TEXT", nullable: false),
                    PlanoId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Valor = table.Column<decimal>(type: "TEXT", precision: 10, scale: 2, nullable: false),
                    DataVencimento = table.Column<DateTime>(type: "TEXT", nullable: false),
                    PagoEm = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Status = table.Column<int>(type: "INTEGER", nullable: false),
                    Observacao = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    CriadoEm = table.Column<DateTime>(type: "TEXT", nullable: false),
                    AtualizadoEm = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Ativo = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mensalidades", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Mensalidades_Alunos_AlunoId",
                        column: x => x.AlunoId,
                        principalTable: "Alunos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Mensalidades_Planos_PlanoId",
                        column: x => x.PlanoId,
                        principalTable: "Planos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Treinos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    AlunoId = table.Column<Guid>(type: "TEXT", nullable: false),
                    ProfessorId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Nome = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Descricao = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true),
                    DataInicio = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DataFim = table.Column<DateTime>(type: "TEXT", nullable: true),
                    DiaSemana = table.Column<int>(type: "INTEGER", nullable: false),
                    CriadoEm = table.Column<DateTime>(type: "TEXT", nullable: false),
                    AtualizadoEm = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Ativo = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Treinos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Treinos_Alunos_AlunoId",
                        column: x => x.AlunoId,
                        principalTable: "Alunos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Treinos_Professores_ProfessorId",
                        column: x => x.ProfessorId,
                        principalTable: "Professores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Agendamentos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    AlunoId = table.Column<Guid>(type: "TEXT", nullable: false),
                    AulaId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Data = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Status = table.Column<int>(type: "INTEGER", nullable: false),
                    CriadoEm = table.Column<DateTime>(type: "TEXT", nullable: false),
                    AtualizadoEm = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Ativo = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Agendamentos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Agendamentos_Alunos_AlunoId",
                        column: x => x.AlunoId,
                        principalTable: "Alunos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Agendamentos_Aulas_AulaId",
                        column: x => x.AulaId,
                        principalTable: "Aulas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Pagamentos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    MensalidadeId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Metodo = table.Column<int>(type: "INTEGER", nullable: false),
                    Valor = table.Column<decimal>(type: "TEXT", precision: 10, scale: 2, nullable: false),
                    Data = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Comprovante = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    Status = table.Column<int>(type: "INTEGER", nullable: false),
                    TransacaoId = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    CriadoEm = table.Column<DateTime>(type: "TEXT", nullable: false),
                    AtualizadoEm = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Ativo = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pagamentos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Pagamentos_Mensalidades_MensalidadeId",
                        column: x => x.MensalidadeId,
                        principalTable: "Mensalidades",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Series",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    TreinoId = table.Column<Guid>(type: "TEXT", nullable: false),
                    ExercicioId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Repeticoes = table.Column<int>(type: "INTEGER", nullable: false),
                    Carga = table.Column<double>(type: "REAL", precision: 6, scale: 2, nullable: true),
                    DescansoSegundos = table.Column<int>(type: "INTEGER", nullable: false),
                    Ordem = table.Column<int>(type: "INTEGER", nullable: false),
                    Observacao = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    CriadoEm = table.Column<DateTime>(type: "TEXT", nullable: false),
                    AtualizadoEm = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Ativo = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Series", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Series_Exercicios_ExercicioId",
                        column: x => x.ExercicioId,
                        principalTable: "Exercicios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Series_Treinos_TreinoId",
                        column: x => x.TreinoId,
                        principalTable: "Treinos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Exercicios",
                columns: new[] { "Id", "Ativo", "AtualizadoEm", "CriadoEm", "Descricao", "GrupoMuscular", "ImagemUrl", "Instrucoes", "Nome", "VideoUrl" },
                values: new object[,]
                {
                    { new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567820"), true, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Exercício para peito com barra", 0, null, null, "Supino Reto", null },
                    { new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567821"), true, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Exercício para pernas com barra", 8, null, null, "Agachamento", null },
                    { new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567822"), true, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Exercício para costas na polia", 1, null, null, "Puxada Frontal", null },
                    { new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567823"), true, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Exercício para ombros com halteres", 2, null, null, "Desenvolvimento", null },
                    { new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567824"), true, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Exercício para bíceps com barra", 3, null, null, "Rosca Direta", null },
                    { new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567825"), true, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Exercício para tríceps na polia", 4, null, null, "Tríceps Pulley", null },
                    { new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567826"), true, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Exercício para pernas na máquina", 8, null, null, "Leg Press", null },
                    { new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567827"), true, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Exercício para quadríceps", 8, null, null, "Cadeira Extensora", null },
                    { new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567828"), true, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Exercício para posterior de coxa", 9, null, null, "Cadeira Flexora", null },
                    { new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567829"), true, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Exercício para abdômen", 6, null, null, "Abdominal Crunch", null }
                });

            migrationBuilder.InsertData(
                table: "Planos",
                columns: new[] { "Id", "Ativo", "AtualizadoEm", "CriadoEm", "Descricao", "DuracaoDias", "Nome", "Ordem", "PermiteAulas", "PermitePersonal", "Preco", "Recursos" },
                values: new object[,]
                {
                    { new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567810"), true, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Comece sua transformação", 30, "Básico", 1, false, false, 89.90m, "Musculação,Avaliação física,Treinos livres,Suporte básico" },
                    { new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567811"), true, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Resultados mais rápidos e completos", 30, "Completo", 2, true, true, 129.90m, "Musculação,Avaliação física,Aulas coletivas,Treinos personalizados,Suporte prioritário" },
                    { new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567812"), true, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Experiência sem limites", 30, "Premium", 3, true, true, 199.90m, "Tudo do Completo,Consultoria exclusiva,Check-ups mensais,App personalizado,Acesso total" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Agendamentos_AlunoId",
                table: "Agendamentos",
                column: "AlunoId");

            migrationBuilder.CreateIndex(
                name: "IX_Agendamentos_AulaId",
                table: "Agendamentos",
                column: "AulaId");

            migrationBuilder.CreateIndex(
                name: "IX_Agendamentos_Data",
                table: "Agendamentos",
                column: "Data");

            migrationBuilder.CreateIndex(
                name: "IX_Agendamentos_Status",
                table: "Agendamentos",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Alunos_PlanoId",
                table: "Alunos",
                column: "PlanoId");

            migrationBuilder.CreateIndex(
                name: "IX_Alunos_ProfessorId",
                table: "Alunos",
                column: "ProfessorId");

            migrationBuilder.CreateIndex(
                name: "IX_Alunos_Status",
                table: "Alunos",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Alunos_UsuarioId",
                table: "Alunos",
                column: "UsuarioId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_Aulas_Ativa",
                table: "Aulas",
                column: "Ativa");

            migrationBuilder.CreateIndex(
                name: "IX_Aulas_ProfessorId",
                table: "Aulas",
                column: "ProfessorId");

            migrationBuilder.CreateIndex(
                name: "IX_Avaliacoes_AlunoId",
                table: "Avaliacoes",
                column: "AlunoId");

            migrationBuilder.CreateIndex(
                name: "IX_Avaliacoes_Data",
                table: "Avaliacoes",
                column: "Data");

            migrationBuilder.CreateIndex(
                name: "IX_Avaliacoes_ProfessorId",
                table: "Avaliacoes",
                column: "ProfessorId");

            migrationBuilder.CreateIndex(
                name: "IX_Checkins_AlunoId",
                table: "Checkins",
                column: "AlunoId");

            migrationBuilder.CreateIndex(
                name: "IX_Checkins_DataEntrada",
                table: "Checkins",
                column: "DataEntrada");

            migrationBuilder.CreateIndex(
                name: "IX_Checkins_Status",
                table: "Checkins",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Exercicios_GrupoMuscular",
                table: "Exercicios",
                column: "GrupoMuscular");

            migrationBuilder.CreateIndex(
                name: "IX_Funcionarios_UsuarioId",
                table: "Funcionarios",
                column: "UsuarioId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Historicos_AlunoId",
                table: "Historicos",
                column: "AlunoId");

            migrationBuilder.CreateIndex(
                name: "IX_Historicos_Tipo",
                table: "Historicos",
                column: "Tipo");

            migrationBuilder.CreateIndex(
                name: "IX_Logs_CriadoEm",
                table: "Logs",
                column: "CriadoEm");

            migrationBuilder.CreateIndex(
                name: "IX_Logs_Tipo",
                table: "Logs",
                column: "Tipo");

            migrationBuilder.CreateIndex(
                name: "IX_Logs_UsuarioId",
                table: "Logs",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Mensalidades_AlunoId",
                table: "Mensalidades",
                column: "AlunoId");

            migrationBuilder.CreateIndex(
                name: "IX_Mensalidades_DataVencimento",
                table: "Mensalidades",
                column: "DataVencimento");

            migrationBuilder.CreateIndex(
                name: "IX_Mensalidades_PlanoId",
                table: "Mensalidades",
                column: "PlanoId");

            migrationBuilder.CreateIndex(
                name: "IX_Mensalidades_Status",
                table: "Mensalidades",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Notificacoes_Lida",
                table: "Notificacoes",
                column: "Lida");

            migrationBuilder.CreateIndex(
                name: "IX_Notificacoes_UsuarioId",
                table: "Notificacoes",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Pagamentos_Data",
                table: "Pagamentos",
                column: "Data");

            migrationBuilder.CreateIndex(
                name: "IX_Pagamentos_MensalidadeId",
                table: "Pagamentos",
                column: "MensalidadeId");

            migrationBuilder.CreateIndex(
                name: "IX_Pagamentos_Status",
                table: "Pagamentos",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Perfis_UsuarioId",
                table: "Perfis",
                column: "UsuarioId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Planos_Ativo",
                table: "Planos",
                column: "Ativo");

            migrationBuilder.CreateIndex(
                name: "IX_Planos_Nome",
                table: "Planos",
                column: "Nome",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Professores_CREF",
                table: "Professores",
                column: "CREF",
                unique: true,
                filter: "[CREF] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Professores_UsuarioId",
                table: "Professores",
                column: "UsuarioId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_ExpiraEm",
                table: "RefreshTokens",
                column: "ExpiraEm");

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_Token",
                table: "RefreshTokens",
                column: "Token",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_UsuarioId",
                table: "RefreshTokens",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Series_ExercicioId",
                table: "Series",
                column: "ExercicioId");

            migrationBuilder.CreateIndex(
                name: "IX_Series_TreinoId",
                table: "Series",
                column: "TreinoId");

            migrationBuilder.CreateIndex(
                name: "IX_Treinos_AlunoId",
                table: "Treinos",
                column: "AlunoId");

            migrationBuilder.CreateIndex(
                name: "IX_Treinos_Ativo",
                table: "Treinos",
                column: "Ativo");

            migrationBuilder.CreateIndex(
                name: "IX_Treinos_ProfessorId",
                table: "Treinos",
                column: "ProfessorId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "Usuarios",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Email",
                table: "Usuarios",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Role",
                table: "Usuarios",
                column: "Role");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "Usuarios",
                column: "NormalizedUserName",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Agendamentos");

            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "Avaliacoes");

            migrationBuilder.DropTable(
                name: "Checkins");

            migrationBuilder.DropTable(
                name: "Funcionarios");

            migrationBuilder.DropTable(
                name: "Historicos");

            migrationBuilder.DropTable(
                name: "Logs");

            migrationBuilder.DropTable(
                name: "Notificacoes");

            migrationBuilder.DropTable(
                name: "Pagamentos");

            migrationBuilder.DropTable(
                name: "Perfis");

            migrationBuilder.DropTable(
                name: "RefreshTokens");

            migrationBuilder.DropTable(
                name: "Series");

            migrationBuilder.DropTable(
                name: "Aulas");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "Mensalidades");

            migrationBuilder.DropTable(
                name: "Exercicios");

            migrationBuilder.DropTable(
                name: "Treinos");

            migrationBuilder.DropTable(
                name: "Alunos");

            migrationBuilder.DropTable(
                name: "Planos");

            migrationBuilder.DropTable(
                name: "Professores");

            migrationBuilder.DropTable(
                name: "Usuarios");
        }
    }
}

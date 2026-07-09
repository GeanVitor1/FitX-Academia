using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitX.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddCheckinRequests : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CheckinRequests",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    AlunoId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Status = table.Column<int>(type: "INTEGER", nullable: false),
                    RespondidaEm = table.Column<DateTime>(type: "TEXT", nullable: true),
                    RespondidaPorId = table.Column<Guid>(type: "TEXT", nullable: true),
                    CriadoEm = table.Column<DateTime>(type: "TEXT", nullable: false),
                    AtualizadoEm = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Ativo = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CheckinRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CheckinRequests_Alunos_AlunoId",
                        column: x => x.AlunoId,
                        principalTable: "Alunos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CheckinRequests_Usuarios_RespondidaPorId",
                        column: x => x.RespondidaPorId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CheckinRequests_AlunoId",
                table: "CheckinRequests",
                column: "AlunoId");

            migrationBuilder.CreateIndex(
                name: "IX_CheckinRequests_CriadoEm",
                table: "CheckinRequests",
                column: "CriadoEm");

            migrationBuilder.CreateIndex(
                name: "IX_CheckinRequests_RespondidaPorId",
                table: "CheckinRequests",
                column: "RespondidaPorId");

            migrationBuilder.CreateIndex(
                name: "IX_CheckinRequests_Status",
                table: "CheckinRequests",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CheckinRequests");
        }
    }
}

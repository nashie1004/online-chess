using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace online_chess.Server.Migrations.MainDb
{
    /// <inheritdoc />
    public partial class InitialIdentity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GameHistories",
                columns: table => new
                {
                    GameHistoryId = table.Column<long>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CreateDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    PlayerOneId = table.Column<long>(type: "INTEGER", nullable: false),
                    PlayerOneColor = table.Column<short>(type: "INTEGER", nullable: false),
                    PlayerTwoId = table.Column<long>(type: "INTEGER", nullable: false),
                    PlayerTwoColor = table.Column<short>(type: "INTEGER", nullable: false),
                    WinnerPlayerId = table.Column<long>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameHistories", x => x.GameHistoryId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GameHistories");
        }
    }
}

using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace online_chess.Server.Migrations.MainDb
{
    /// <inheritdoc />
    public partial class AddGameHistoryList : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GameHistoryList",
                columns: table => new
                {
                    IndexNo = table.Column<int>(type: "INTEGER", nullable: false),
                    GameStatus = table.Column<short>(type: "INTEGER", nullable: false),
                    IsColorWhite = table.Column<bool>(type: "INTEGER", nullable: false),
                    GameType = table.Column<short>(type: "INTEGER", nullable: false),
                    OpponentName = table.Column<string>(type: "TEXT", nullable: false),
                    GameDate = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GameHistoryList");
        }
    }
}

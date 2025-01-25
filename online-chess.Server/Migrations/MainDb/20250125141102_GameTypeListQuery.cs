using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace online_chess.Server.Migrations.MainDb
{
    /// <inheritdoc />
    public partial class GameTypeListQuery : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GameTypeList",
                columns: table => new
                {
                    Rank = table.Column<int>(type: "INTEGER", nullable: false),
                    Username = table.Column<string>(type: "TEXT", nullable: false),
                    Wins = table.Column<int>(type: "INTEGER", nullable: false),
                    Loses = table.Column<int>(type: "INTEGER", nullable: false),
                    Draws = table.Column<int>(type: "INTEGER", nullable: false),
                    LastGameDate = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GameTypeList");
        }
    }
}

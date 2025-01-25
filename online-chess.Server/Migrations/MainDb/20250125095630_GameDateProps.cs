using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace online_chess.Server.Migrations.MainDb
{
    /// <inheritdoc />
    public partial class GameDateProps : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CreateDate",
                table: "GameHistories",
                newName: "GameStartDate");

            migrationBuilder.AddColumn<DateTime>(
                name: "GameEndDate",
                table: "GameHistories",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GameEndDate",
                table: "GameHistories");

            migrationBuilder.RenameColumn(
                name: "GameStartDate",
                table: "GameHistories",
                newName: "CreateDate");
        }
    }
}

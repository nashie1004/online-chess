using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace online_chess.Server.Migrations.MainDb
{
    /// <inheritdoc />
    public partial class AdditionalHistoryProp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<short>(
                name: "GameType",
                table: "GameHistories",
                type: "INTEGER",
                nullable: false,
                defaultValue: (short)0);

            migrationBuilder.AddColumn<bool>(
                name: "IsDraw",
                table: "GameHistories",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GameType",
                table: "GameHistories");

            migrationBuilder.DropColumn(
                name: "IsDraw",
                table: "GameHistories");
        }
    }
}

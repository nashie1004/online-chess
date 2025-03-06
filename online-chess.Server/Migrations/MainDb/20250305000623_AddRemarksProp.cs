using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace online_chess.Server.Migrations.MainDb
{
    /// <inheritdoc />
    public partial class AddRemarksProp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Remarks",
                table: "GameHistories",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Remarks",
                table: "GameHistories");
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace online_chess.Server.Migrations.MainDb
{
    /// <inheritdoc />
    public partial class FixForAnotherMigrationError : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProfileImageUrl",
                table: "LeaderboardList",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProfileImageUrl",
                table: "GameTypeList",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ProfileImageUrl",
                table: "GameHistoryList",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfileImageUrl",
                table: "LeaderboardList");

            migrationBuilder.DropColumn(
                name: "ProfileImageUrl",
                table: "GameTypeList");

            migrationBuilder.DropColumn(
                name: "ProfileImageUrl",
                table: "GameHistoryList");
        }
    }
}

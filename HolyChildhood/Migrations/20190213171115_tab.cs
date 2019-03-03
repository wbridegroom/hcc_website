using Microsoft.EntityFrameworkCore.Migrations;

namespace HolyChildhood.Migrations
{
    public partial class tab : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TextContentId",
                table: "Tabs",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tabs_TextContentId",
                table: "Tabs",
                column: "TextContentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tabs_TextContents_TextContentId",
                table: "Tabs",
                column: "TextContentId",
                principalTable: "TextContents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tabs_TextContents_TextContentId",
                table: "Tabs");

            migrationBuilder.DropIndex(
                name: "IX_Tabs_TextContentId",
                table: "Tabs");

            migrationBuilder.DropColumn(
                name: "TextContentId",
                table: "Tabs");
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

namespace HolyChildhood.Migrations
{
    public partial class file_type_title : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "FileContents",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Title",
                table: "FileContents");
        }
    }
}

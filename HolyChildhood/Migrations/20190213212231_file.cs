using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HolyChildhood.Migrations
{
    public partial class file : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tabs_TabContents_TabContentId",
                table: "Tabs");

            migrationBuilder.AlterColumn<int>(
                name: "TabContentId",
                table: "Tabs",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FileContentId",
                table: "PageContents",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FileContentId",
                table: "Files",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "FileContents",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    FileType = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FileContents", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PageContents_FileContentId",
                table: "PageContents",
                column: "FileContentId");

            migrationBuilder.CreateIndex(
                name: "IX_Files_FileContentId",
                table: "Files",
                column: "FileContentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Files_FileContents_FileContentId",
                table: "Files",
                column: "FileContentId",
                principalTable: "FileContents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PageContents_FileContents_FileContentId",
                table: "PageContents",
                column: "FileContentId",
                principalTable: "FileContents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tabs_TabContents_TabContentId",
                table: "Tabs",
                column: "TabContentId",
                principalTable: "TabContents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Files_FileContents_FileContentId",
                table: "Files");

            migrationBuilder.DropForeignKey(
                name: "FK_PageContents_FileContents_FileContentId",
                table: "PageContents");

            migrationBuilder.DropForeignKey(
                name: "FK_Tabs_TabContents_TabContentId",
                table: "Tabs");

            migrationBuilder.DropTable(
                name: "FileContents");

            migrationBuilder.DropIndex(
                name: "IX_PageContents_FileContentId",
                table: "PageContents");

            migrationBuilder.DropIndex(
                name: "IX_Files_FileContentId",
                table: "Files");

            migrationBuilder.DropColumn(
                name: "FileContentId",
                table: "PageContents");

            migrationBuilder.DropColumn(
                name: "FileContentId",
                table: "Files");

            migrationBuilder.AlterColumn<int>(
                name: "TabContentId",
                table: "Tabs",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_Tabs_TabContents_TabContentId",
                table: "Tabs",
                column: "TabContentId",
                principalTable: "TabContents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}

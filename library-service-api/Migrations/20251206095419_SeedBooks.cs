using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace library_service_api.Migrations
{
    /// <inheritdoc />
    public partial class SeedBooks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Books",
                columns: new[] { "Id", "Author", "Description", "Title" },
                values: new object[,]
                {
                    { 1, "Jon Skeet", "Deep dive into C#", "C# in Depth" },
                    { 2, "Robert C. Martin", "Code quality and best practices", "Clean Code" },
                    { 3, "Microsoft Docs", "Learn ASP.NET Core fundamentals", "ASP.NET Core Guide" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 3);
        }
    }
}

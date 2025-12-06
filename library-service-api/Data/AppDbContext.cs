using library_service_api.Models;
using Microsoft.EntityFrameworkCore;

namespace library_service_api.Data
{
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Book> Books => Set<Book>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed data
            modelBuilder.Entity<Book>().HasData(
                new Book { Id = 1, Title = "C# in Depth", Author = "Jon Skeet", Description = "Deep dive into C#" },
                new Book { Id = 2, Title = "Clean Code", Author = "Robert C. Martin", Description = "Code quality and best practices" },
                new Book { Id = 3, Title = "ASP.NET Core Guide", Author = "Microsoft Docs", Description = "Learn ASP.NET Core fundamentals" }
            );
        }

    }
}

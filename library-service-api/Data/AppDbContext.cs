using library_service_api.Models;
using Microsoft.EntityFrameworkCore;

namespace library_service_api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // DbSets
        public DbSet<Book> Books => Set<Book>();
        public DbSet<Author> Authors => Set<Author>();
        public DbSet<BookCopy> BookCopies => Set<BookCopy>();
        public DbSet<Member> Members => Set<Member>();
        public DbSet<Loan> Loans => Set<Loan>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ------------------------------
            // RELATIONSHIPS
            // ------------------------------

            modelBuilder.Entity<Book>()
                .HasOne(b => b.Author)
                .WithMany(a => a.Books)
                .HasForeignKey(b => b.AuthorId);

            modelBuilder.Entity<BookCopy>()
                .HasOne(bc => bc.Book)
                .WithMany(b => b.BookCopies)
                .HasForeignKey(bc => bc.BookId);

            modelBuilder.Entity<Member>()
                .HasMany(m => m.Loans)
                .WithOne(l => l.Member)
                .HasForeignKey(l => l.MemberId);

            modelBuilder.Entity<BookCopy>()
                .HasOne(bc => bc.Loan)
                .WithOne(l => l.BookCopy)
                .HasForeignKey<Loan>(l => l.BookCopyId);


            // ------------------------------
            // SEED DATA
            // ------------------------------

            // Authors
            modelBuilder.Entity<Author>().HasData(
                new Author { Id = 1, Name = "Jon Skeet" },
                new Author { Id = 2, Name = "Robert C. Martin" },
                new Author { Id = 3, Name = "Microsoft Docs Team" }
            );

            // Books
            modelBuilder.Entity<Book>().HasData(
                new Book { Id = 1, Title = "C# in Depth", Description = "Deep dive into C#", AuthorId = 1 },
                new Book { Id = 2, Title = "Clean Code", Description = "Code quality and best practices", AuthorId = 2 },
                new Book { Id = 3, Title = "ASP.NET Core Guide", Description = "Learn ASP.NET Core fundamentals", AuthorId = 3 }
            );

            // BookCopies
            modelBuilder.Entity<BookCopy>().HasData(
                new BookCopy { Id = 1, BookId = 1, TotalCopies = 5, AvailableCopies = 4 },
                new BookCopy { Id = 2, BookId = 2, TotalCopies = 3, AvailableCopies = 3 },
                new BookCopy { Id = 3, BookId = 3, TotalCopies = 4, AvailableCopies = 4 }
            );

            // Members
            modelBuilder.Entity<Member>().HasData(
                new Member { Id = 1, FullName = "Alice Walker", Email = "alice@example.com" },
                new Member { Id = 2, FullName = "John Carter", Email = "john@example.com" }
            );

            // Loans (Loan is ONE-TO-ONE with BookCopy)
            modelBuilder.Entity<Loan>().HasData(
                new Loan
                {
                    Id = 1,
                    BorrowDate = new DateTime(2025, 1, 10),
                    DueDate = new DateTime(2025, 1, 20),
                    Returned = false,
                    ReturnedDate = null,
                    MemberId = 1,
                    BookCopyId = 1 // This reduces AvailableCopies from 5 → 4
                }
            );
        }
    }
}

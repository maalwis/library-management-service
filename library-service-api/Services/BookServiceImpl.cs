using library_service_api.Data;
using library_service_api.Dtos;
using library_service_api.Models;
using Microsoft.EntityFrameworkCore;

namespace library_service_api.Services
{
    public class BookServiceImpl : IBookService
    {
        private readonly AppDbContext _context;

        public BookServiceImpl(AppDbContext context)
        {
            _context = context;
        }

        // Method to get all the books
        public async Task<List<BookResponseDto>> GetAllAsync()
        {
            return await _context.Books
                .Include(b => b.Author)
                .Include(b => b.BookCopies)
                .Select(b => new BookResponseDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    Description = b.Description,
                    AuthorName = b.Author.Name,
                    TotalCopies = b.BookCopies.Sum(c => c.TotalCopies),
                    AvailableCopies = b.BookCopies.Sum(c => c.AvailableCopies)
                })
                .ToListAsync();
        }

        // Method to get a book by Id
        public async Task<BookResponseDto?> GetByIdAsync(int id)
        {
            return await _context.Books
                .Include(b => b.Author)
                .Include(b => b.BookCopies)
                .Where(b => b.Id == id)
                .Select(b => new BookResponseDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    Description = b.Description,
                    AuthorName = b.Author.Name,
                    TotalCopies = b.BookCopies.Sum(c => c.TotalCopies),
                    AvailableCopies = b.BookCopies.Sum(c => c.AvailableCopies)
                })
                .FirstOrDefaultAsync();
        }

        // Method to create a book
        // Creates a new book entry or updates copies if the book already exists.
        public async Task<BookResponseDto> CreateAsync(BookCreateDto dto)
        {
            // Attempt to find an existing book by title (case-insensitive).
            // Includes related Author and BookCopy data because we may need them below.
            var existingBook = await _context.Books
                .Include(b => b.BookCopies)
                .Include(b => b.Author)
                .FirstOrDefaultAsync(b => b.Title.ToLower() == dto.Title.ToLower());

            // Attempt to find the author (case-insensitive).
            // This is needed whether we are creating a new book or updating an existing one.
            var author = await _context.Authors
                .FirstOrDefaultAsync(a => a.Name.ToLower() == dto.AuthorName.ToLower());

            // If both the book and its author already exist, update the existing copies instead of creating a new book.
            if (existingBook != null && author != null)
            {
                // Retrieve the existing BookCopy entry for this book.
                var existingBookCopy = await _context.BookCopies
                    .FirstOrDefaultAsync(c => c.BookId == existingBook.Id);

                // If the book exists but no BookCopy is found, the data is inconsistent and should be reported.
                if (existingBookCopy == null)
                {
                    throw new Exception("Book exists but has no copy record. Data may be corrupted.");
                }

                // Increase the total and available copies for the existing book.
                existingBookCopy.TotalCopies += 1;
                existingBookCopy.AvailableCopies += 1;

                await _context.SaveChangesAsync();

                return MapToDto(existingBook, author, existingBookCopy);
            }

            // If the author did not exist, create a new one.
            if (author == null)
            {
                author = new Author { Name = dto.AuthorName };
                _context.Authors.Add(author);
                await _context.SaveChangesAsync();
            }

            // Create and save the new book.
            var book = new Book
            {
                Title = dto.Title,
                Description = dto.Description,
                AuthorId = author.Id
            };
            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            // Create the initial BookCopy record for this new book.
            var copy = new BookCopy
            {
                BookId = book.Id,
                TotalCopies = dto.TotalCopies,
                AvailableCopies = dto.TotalCopies
            };
            _context.BookCopies.Add(copy);
            await _context.SaveChangesAsync();

            // Return the newly created book mapped to a DTO.
            return MapToDto(book, author, copy);

        }

        // Method to update a book
        public async Task<BookResponseDto?> UpdateAsync(int id, BookUpdateDto dto)
        {
            var book = await _context.Books
                .Include(b => b.Author)
                .Include(b => b.BookCopies)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (book == null) return null;

            book.Title = dto.Title;
            book.Description = dto.Description;

            var author = await _context.Authors
                .FirstOrDefaultAsync(a => a.Name.ToLower() == dto.AuthorName.ToLower());

            if (author == null)
            {
                author = new Author { Name = dto.AuthorName };
                _context.Authors.Add(author);
                await _context.SaveChangesAsync();
            }
            book.AuthorId = author.Id;

            var copy = book.BookCopies.FirstOrDefault();
            if (copy != null)
            {
                if (dto.TotalCopies.HasValue) copy.TotalCopies = dto.TotalCopies.Value;
                if (dto.AvailableCopies.HasValue) copy.AvailableCopies = dto.AvailableCopies.Value;
            }

            await _context.SaveChangesAsync();

            return new BookResponseDto
            {
                Id = book.Id,
                Title = book.Title,
                Description = book.Description,
                AuthorName = author.Name,
                TotalCopies = copy?.TotalCopies ?? 0,
                AvailableCopies = copy?.AvailableCopies ?? 0
            };
        }

        // Soft delete a book
        public async Task<bool> SoftDeleteAsync(int id)
        {
            var book = await _context.Books
                .Include(b => b.BookCopies)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (book == null) return false;

            foreach (var copy in book.BookCopies)
            {
                copy.TotalCopies = 0;
                copy.AvailableCopies = 0;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        private BookResponseDto MapToDto(Book book, Author author, BookCopy copy)
        {
            return new BookResponseDto
            {
                Id = book.Id,
                Title = book.Title,
                Description = book.Description,
                AuthorName = author.Name,
                TotalCopies = copy?.TotalCopies ?? 0,
                AvailableCopies = copy?.AvailableCopies ?? 0
            };
        }

    }
}

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

        // Method to get all books
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
        public async Task<BookResponseDto> CreateAsync(BookCreateDto dto)
        {
            var author = await _context.Authors
                .FirstOrDefaultAsync(a => a.Name.ToLower() == dto.AuthorName.ToLower());

            if (author == null)
            {
                author = new Author { Name = dto.AuthorName };
                _context.Authors.Add(author);
                await _context.SaveChangesAsync();
            }

            var book = new Book
            {
                Title = dto.Title,
                Description = dto.Description,
                AuthorId = author.Id
            };
            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            var copy = new BookCopy
            {
                BookId = book.Id,
                TotalCopies = dto.TotalCopies,
                AvailableCopies = dto.AvailableCopies
            };
            _context.BookCopies.Add(copy);
            await _context.SaveChangesAsync();

            return new BookResponseDto
            {
                Id = book.Id,
                Title = book.Title,
                Description = book.Description,
                AuthorName = author.Name,
                TotalCopies = copy.TotalCopies,
                AvailableCopies = copy.AvailableCopies
            };
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
    }
}

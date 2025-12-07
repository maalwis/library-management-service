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
        // Creates a new book entry or updates book-copies if the book already exists.
        public async Task<BookResponseDto> CreateAsync(BookCreateDto dto)
        {
            // Check if the book already exists
            var existingBook = await GetBookByTitleAsync(dto.Title);

            if (existingBook != null)
            {
                // Book exists, make sure it has an author
                if (existingBook.Author == null)
                    throw new Exception("Book exists but has no author. Data may be corrupted.");

                // Check if a BookCopy exists
                var existingBookCopy = existingBook.BookCopies.FirstOrDefault();
                if (existingBookCopy == null)
                    throw new Exception("Book exists but has no copy record. Data may be corrupted.");

                // Increase copies
                existingBookCopy.TotalCopies += dto.TotalCopies;
                existingBookCopy.AvailableCopies += dto.TotalCopies;

                await _context.SaveChangesAsync();

                return MapToDto(existingBook, existingBook.Author, existingBookCopy);
            }

            // Book does not exist, ensure author exists
            var author = await GetAuthorByNameAsync(dto.AuthorName);
            if (author == null)
                author = await CreateNewAuthor(dto.AuthorName);

            // Create new book
            var book = await CreateNewBook(dto.Title, dto.Description, author.Id);

            // Create initial BookCopy
            var copy = await CreateNewBookCopy(book.Id, dto.TotalCopies, dto.TotalCopies);

            // Return DTO
            return MapToDto(book, author, copy);
        }


        //Method to update a book
        public async Task<BookResponseDto?> UpdateAsync(int id, BookUpdateDto dto)
        {
            var existingBook = await GetBookByIdAsync(id);

            if (existingBook == null)
                throw new Exception($"Book with ID {id} does not exist.");

            // Update basic book properties
            existingBook.Title = dto.Title;
            existingBook.Description = dto.Description;

            // Handle author - get existing or create new
            var author = await GetAuthorByNameAsync(dto.AuthorName);
            if (author == null)
            {
                author = await CreateNewAuthor(dto.AuthorName);
            }
            existingBook.AuthorId = author.Id;

            // Handle book copy updates if provided
            var copy = existingBook.BookCopies.FirstOrDefault();
            if (copy != null)
            {
                if (dto.TotalCopies.HasValue)
                    copy.TotalCopies = dto.TotalCopies.Value;
                if (dto.AvailableCopies.HasValue)
                    copy.AvailableCopies = dto.AvailableCopies.Value;
            }
            else if (dto.TotalCopies.HasValue && dto.AvailableCopies.HasValue)
            {
                // If no copy exists but copy data is provided, create a new one
                copy = await CreateNewBookCopy(existingBook.Id, dto.TotalCopies.Value, dto.AvailableCopies.Value);
            }

            await _context.SaveChangesAsync();

            return MapToDto(existingBook, author, copy);
        }

        // Soft delete a book
        public async Task<bool> SoftDeleteAsync(int id)
        {
            var existingBook = await GetBookByIdAsync(id);

            if (existingBook == null)
                throw new Exception($"Book with ID {id} does not exist.");

            foreach (var copy in existingBook.BookCopies)
            {
                copy.TotalCopies = 0;
                copy.AvailableCopies = 0;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        private async Task<Book?> GetBookByTitleAsync(string title)
        {
            return await _context.Books
                .Include(b => b.BookCopies)
                .Include(b => b.Author)
                .FirstOrDefaultAsync(b => b.Title.ToLower() == title.ToLower());
        }

        private async Task<Book?> GetBookByIdAsync(int id)
        {
            return await _context.Books
                .Include(b => b.Author)
                .Include(b => b.BookCopies)
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        private async Task<Author?> GetAuthorByNameAsync(string authorName)
        {
            return await _context.Authors
                .FirstOrDefaultAsync(a => a.Name.ToLower() == authorName.ToLower());
        }

        private async Task<Author> CreateNewAuthor(String authorName) 
        {
            var author = new Author { Name = authorName };
            _context.Authors.Add(author);
            await _context.SaveChangesAsync();

            return author;
        }

        private async Task<Book> CreateNewBook(String title, String description, int authorId) 
        {
            var book = new Book
            {
                Title = title,
                Description = description,
                AuthorId = authorId
            };
            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return book;

        }

        private async Task<BookCopy> CreateNewBookCopy(int bookId, int totalCopies, int availableCopies)
        {
            var copy = new BookCopy
            {
                BookId = bookId,
                TotalCopies = totalCopies,
                AvailableCopies = availableCopies
            };
            _context.BookCopies.Add(copy);
            await _context.SaveChangesAsync();

            return copy;
        }

        private BookResponseDto MapToDto(Book book, Author author, BookCopy copy)
        {
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

    }
}

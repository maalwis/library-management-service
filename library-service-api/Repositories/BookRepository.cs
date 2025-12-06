using library_service_api.Data;
using library_service_api.Models;
using Microsoft.EntityFrameworkCore;

namespace library_service_api.Repositories
{
    public class BookRepository: IBookRepository
    {
        private readonly AppDbContext _context;
        public BookRepository(AppDbContext context) 
        { 
            _context = context;
        }

        public List<Book> GetAll()
        {
            return _context.Books.ToList();
        }
    }
}

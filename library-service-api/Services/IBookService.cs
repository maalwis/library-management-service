using library_service_api.Models;

namespace library_service_api.Services
{
    public interface IBookService
    {
        List<Book> GetAllBooks();
    }
}

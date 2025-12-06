using library_service_api.Models;

namespace library_service_api.Repositories
{
    public interface IBookRepository
    {
        List<Book> GetAll();
    }
}

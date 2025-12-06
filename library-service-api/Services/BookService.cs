using library_service_api.Data;
using library_service_api.Models;
using library_service_api.Repositories;

namespace library_service_api.Services
{
    public class BookService : IBookService
    {

        private readonly IBookRepository _repository;

        public BookService(IBookRepository repository)
        {
            _repository = repository;
        }

        public List<Book> GetAllBooks()
        {
            return _repository.GetAll();
        }
    }
}

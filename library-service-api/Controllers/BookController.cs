using library_service_api.Models;
using library_service_api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace library_service_api.Controllers
{
    [Route("api/v1/books")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly IBookService _bookService;

        // Inject the service through constructor injection
        public BookController(IBookService bookService)
        {
            _bookService = bookService;
        }


        // GET: api/v1/books
        [HttpGet]
        public IActionResult GetBooks()
        {
            var books = _bookService.GetAllBooks();
            return Ok(books);
        }
    }
}

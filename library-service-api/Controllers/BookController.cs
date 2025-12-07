using library_service_api.Dtos;
using library_service_api.Services;
using Microsoft.AspNetCore.Mvc;

namespace library_service_api.Controllers
{
    [Route("api/v1/books")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly IBookService _bookService;

        public BookController(IBookService bookService)
        {
            _bookService = bookService;
        }

        // GET: api/v1/books
        [HttpGet]
        public async Task<IActionResult> GetBooks()
        {
            try
            {
                var books = await _bookService.GetAllAsync();

                if (books == null || books.Count == 0)
                    return NotFound(new { message = "No books found." });

                return Ok(books);
            }
            catch (Exception ex)
            {
                // Log the exception (use ILogger in real apps)
                return StatusCode(500, new { message = "An error occurred while retrieving books.", detail = ex.Message });
            }
        }

        // GET: api/v1/books/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookById(int id)
        {
            try
            {
                var book = await _bookService.GetByIdAsync(id);
                if (book == null)
                    return NotFound(new { message = $"Book with id {id} not found." });

                return Ok(book);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the book.", detail = ex.Message });
            }
        }

        // POST: api/v1/books
        [HttpPost]
        public async Task<IActionResult> CreateBook([FromBody] BookCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var createdBook = await _bookService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetBookById), new { id = createdBook.Id }, createdBook);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the book.", detail = ex.Message });
            }
        }

        // PUT: api/v1/books/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, [FromBody] BookUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var updatedBook = await _bookService.UpdateAsync(id, dto);
                if (updatedBook == null)
                    return NotFound(new { message = $"Book with id {id} not found." });

                return Ok(updatedBook);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the book.", detail = ex.Message });
            }
        }

        // DELETE: api/v1/books/{id} (soft delete)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            try
            {
                bool deleted = await _bookService.SoftDeleteAsync(id);
                if (!deleted)
                    return NotFound(new { message = $"Book with id {id} not found." });

                return Ok(new { message = $"Book with id {id} has been soft deleted (copies set to 0)." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the book.", detail = ex.Message });
            }
        }
    }
}

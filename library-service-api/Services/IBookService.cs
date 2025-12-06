using library_service_api.Dtos;
using library_service_api.Models;

namespace library_service_api.Services
{
    public interface IBookService
    {
        Task<List<BookResponseDto>> GetAllAsync();

        Task<BookResponseDto?> GetByIdAsync(int id);

        Task<BookResponseDto> CreateAsync(BookCreateDto dto);

        Task<BookResponseDto?> UpdateAsync(int id, BookUpdateDto dto);

        Task<bool> SoftDeleteAsync(int id);
    }

}

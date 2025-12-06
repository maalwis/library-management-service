using System.ComponentModel.DataAnnotations;

namespace library_service_api.Models
{
    public class Book
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        public string Author { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;
    }
}

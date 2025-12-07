using System.ComponentModel.DataAnnotations;

namespace library_service_api.Models
{
    public class Author
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        // Navigation
        public ICollection<Book> Books { get; set; } = new List<Book>();
    }
}

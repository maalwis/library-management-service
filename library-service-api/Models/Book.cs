using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace library_service_api.Models
{
    public class Book
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        // 🔗 Author Relationship
        public int AuthorId { get; set; }

        [JsonIgnore]
        public Author Author { get; set; }

        // 🔗 BookCopy Relationship
        public ICollection<BookCopy> BookCopies { get; set; } = new List<BookCopy>();
    }
}

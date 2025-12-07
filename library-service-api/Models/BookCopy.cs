using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace library_service_api.Models
{
    public class BookCopy
    {
        public int Id { get; set; }

        public int TotalCopies { get; set; }
        public int AvailableCopies { get; set; }

        public bool CanBorrow => AvailableCopies > 0;

        // 🔗 Book Relationship
        public int BookId { get; set; }

        [JsonIgnore]
        public Book Book { get; set; }

        // 🔗 Loan Relationship (1:1)
        public Loan? Loan { get; set; }
    }
}

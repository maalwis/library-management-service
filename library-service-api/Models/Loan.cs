using System.ComponentModel.DataAnnotations;

namespace library_service_api.Models
{
    public class Loan
    {
        public int Id { get; set; }

        public DateTime BorrowDate { get; set; }
        public DateTime DueDate { get; set; }

        public bool Returned { get; set; }
        public DateTime? ReturnedDate { get; set; }

        // 🔗 Member Relationship
        public int MemberId { get; set; }
        public Member Member { get; set; }

        // 🔗 BookCopy Relationship (1:1)
        public int BookCopyId { get; set; }
        public BookCopy BookCopy { get; set; }
    }
}

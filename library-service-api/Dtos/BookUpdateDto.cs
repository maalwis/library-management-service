namespace library_service_api.Dtos
{
    public class BookUpdateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string AuthorName { get; set; } = string.Empty;

        public int? TotalCopies { get; set; }   
        public int? AvailableCopies { get; set; }  
    }
}

namespace library_service_api.Dtos
{
    public class BookCreateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string AuthorName { get; set; } = string.Empty;

        public int TotalCopies { get; set; } = 1; // Default to 1
        public int AvailableCopies { get; set; } = 1; // Default to 1
    }
}

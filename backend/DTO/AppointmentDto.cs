using System.ComponentModel.DataAnnotations;

namespace backend.DTO
{
    public class AppointmentDto
    {
        [Key] // Define a primary key
        public int Id { get; set; }

        public DateTime Date { get; set; }
        public string Problem { get; set; }
    }
}

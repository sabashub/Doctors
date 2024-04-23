namespace backend.DTO
{
    public class ReservationDto
    {
        public int Id { get; set; }
        public UserDto User { get; set; }
        public DateTime ReservationDateTime { get; set; }
        public DoctorDto Doctor { get; set; }


    }
}

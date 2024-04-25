using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly Context _context;

        public AppointmentController(Context context)
        {
            _context = context;
        }

        // POST: api/Appointment/create
        [HttpPost("create")]
        public async Task<ActionResult<Appointment>> CreateAppointment(Appointment appointment)
        {
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAppointment), new { id = appointment.Id }, appointment);
        }
        [HttpGet("getByUserId/{userId}")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointmentsByUserId(string userId)
        {
            var appointments = await _context.Appointments
                .Where(a => a.UserId == userId)
                .ToListAsync();

            if (appointments == null || appointments.Count == 0)
            {
                return NotFound();
            }

            return appointments;
        }
        [HttpGet("getByDoctorId/{doctorId}")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointmentsByDoctorId(int doctorId)
        {
            var appointments = await _context.Appointments
                .Where(a => a.DoctorId == doctorId)
                .ToListAsync();

            if (appointments == null || appointments.Count == 0)
            {
                return NotFound();
            }

            return appointments;
        }

        // GET: api/Appointment/get/5
        [HttpGet("get/{id}")]
        public async Task<ActionResult<Appointment>> GetAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);

            if (appointment == null)
            {
                return NotFound();
            }

            return appointment;
        }

        // PUT: api/Appointment/update/5
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, Appointment appointment)
        {
            if (id != appointment.Id)
            {
                return BadRequest();
            }

            _context.Entry(appointment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AppointmentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Appointment/delete/5
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound();
            }

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AppointmentExists(int id)
        {
            return _context.Appointments.Any(e => e.Id == id);
        }
    }
}

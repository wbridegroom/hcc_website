using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HolyChildhood.Models;
using Microsoft.AspNetCore.Authorization;

namespace HolyChildhood.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class CalendarController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public CalendarController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        // GET: api/Calendar
        [HttpGet]
        [ProducesResponseType(200)]
        public async Task<ActionResult<IEnumerable<Calendar>>> GetCalendars()
        {
            return await dbContext.Calendars.ToListAsync();
        }

        // GET: api/Calendar/5
        [HttpGet("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<Calendar>> GetCalendar(int id)
        {
            var calendar = await dbContext.Calendars.Include(c => c.Events).FirstOrDefaultAsync(c => c.Id == id);

            if (calendar == null) return NotFound();

            return calendar;
        }

        // PUT: api/Calendar/5
        [HttpPut("{id}")]
        [Authorize]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> PutCalendar(int id, Calendar calendar)
        {
            if (id != calendar.Id) return BadRequest(); 

            dbContext.Entry(calendar).State = EntityState.Modified;

            try
            {
                await dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CalendarExists(id)) return NotFound(); 
                throw;
            }

            return NoContent();
        }

        // POST: api/Calendar
        [HttpPost]
        [Authorize]
        [ProducesResponseType(201)]
        public async Task<ActionResult<Calendar>> PostCalendar(Calendar calendar)
        {
            dbContext.Calendars.Add(calendar);
            await dbContext.SaveChangesAsync();

            return CreatedAtAction("GetCalendar", new { id = calendar.Id }, calendar);
        }

        // DELETE: api/Calendar/5
        [HttpDelete("{id}")]
        [Authorize]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<Calendar>> DeleteCalendar(int id)
        {
            var calendar = await dbContext.Calendars.FindAsync(id);
            if (calendar == null) return NotFound();

            dbContext.Calendars.Remove(calendar);
            await dbContext.SaveChangesAsync();

            return calendar;
        }

        private bool CalendarExists(int id)
        {
            return dbContext.Calendars.Any(e => e.Id == id);
        }
    }
}

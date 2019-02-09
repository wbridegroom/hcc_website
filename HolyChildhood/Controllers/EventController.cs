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
    public class EventController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public EventController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        // GET: api/Event
        [HttpGet]
        [ProducesResponseType(200)]
        public async Task<ActionResult<IEnumerable<Event>>> GetEvents()
        {
            return await dbContext.Events.ToListAsync();
        }

        // GET: api/Event/5
        [HttpGet("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<Event>> GetEvent(int id)
        {
            var @event = await dbContext.Events.FindAsync(id);

            if (@event == null)
            {
                return NotFound();
            }

            return @event;
        }

        // PUT: api/Event/5
        [HttpPut("{id}")]
        [Authorize]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> PutEvent(int id, Event @event)
        {
            if (id != @event.Id) return BadRequest();

            dbContext.Entry(@event).State = EntityState.Modified;

            try
            {
                await dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventExists(id)) return NotFound(); 
                throw;
            }

            return NoContent();
        }

        // POST: api/Event
        [HttpPost]
        [Authorize]
        [ProducesResponseType(200)]
        public async Task<ActionResult<Event>> PostEvent(Event @event)
        {
            dbContext.Events.Add(@event);
            await dbContext.SaveChangesAsync();

            return CreatedAtAction("GetEvent", new { id = @event.Id }, @event);
        }

        // DELETE: api/Event/5
        [HttpDelete("{id}")]
        [Authorize]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<Event>> DeleteEvent(int id)
        {
            var @event = await dbContext.Events.FindAsync(id);
            if (@event == null) return NotFound();

            dbContext.Events.Remove(@event);
            await dbContext.SaveChangesAsync();

            return @event;
        }

        private bool EventExists(int id)
        {
            return dbContext.Events.Any(e => e.Id == id);
        }
    }
}

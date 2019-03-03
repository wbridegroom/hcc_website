using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HolyChildhood.Models;
using HolyChildhood.ViewModels;
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

        [HttpGet("{start}/{end}")]
        public async Task<ActionResult<List<EventViewModel>>> GetEvents(DateTime start, DateTime end)
        {
            var events = await dbContext
                .Events
                .Include(e => e.EventType)
                .Where(e => e.BeginDate > start && e.BeginDate < end)
                .ToListAsync();

            var viewEvents = new List<EventViewModel>();
            foreach (var @event in events)
            {
                viewEvents.Add(new EventViewModel
                {
                    Id = @event.Id,
                    Title = @event.Title,
                    Start = @event.BeginDate,
                    Description = @event.Description,
                    Notes = @event.Notes,
                    Location = @event.Location,
                    AllDay = @event.AllDay,
                    EventTypeId = @event.EventType.Id,
                    EventTypeName = @event.EventType.Name,
                    Color = @event.EventType.Color,
                    IsRecurring = @event.IsRecurring,
                    RecurrenceId = @event.RecurrenceId
                });
            }

            return viewEvents;
        }

        // PUT: api/Event/5
        [HttpPut("{id}")]
        [Authorize]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> PutEvent(int id, EventViewModel @event)
        {
            if (id != @event.Id) return BadRequest();

            var dbEvent = await dbContext.Events.FindAsync(id);
            if (dbEvent == null) return NotFound();

            var originalBeginDate = dbEvent.BeginDate;
            var newBeginDate = new DateTime(@event.StartYear, @event.StartMonth, @event.StartDay, @event.StartHour, @event.StartMinute, 0);

            var originalEndDate = dbEvent.EndDate;
            DateTime? newEndDate = null;

            dbEvent.Title = @event.Title;
            dbEvent.BeginDate = newBeginDate;
            dbEvent.Description = @event.Description;
            dbEvent.Location = @event.Location;
            dbEvent.Notes = @event.Notes;
            if (@event.EndYear > 0)
            {
                newEndDate = new DateTime(@event.EndYear, @event.EndMonth, @event.EndDay, @event.EndHour, @event.EndMinute, 0);
                dbEvent.EndDate = newEndDate;
            }

            if (dbEvent.IsRecurring && @event.UpdateRecurrence)
            {
                var recurringEvents = await dbContext
                    .Events
                    .Where(e => e.RecurrenceId == @event.RecurrenceId && e.BeginDate > dbEvent.BeginDate)
                    .ToListAsync();
                foreach (var recurringEvent in recurringEvents)
                {
                    var offset = newBeginDate.Subtract(originalBeginDate);
                    recurringEvent.BeginDate = recurringEvent.BeginDate.Add(offset);
                    if (@event.EndYear > 0 && newEndDate.HasValue && originalEndDate.HasValue)
                    {
                        offset = newEndDate.Value.Subtract(originalEndDate.Value);
                        recurringEvent.EndDate = recurringEvent.EndDate?.Add(offset);
                    }
                    recurringEvent.Title = @event.Title;
                    recurringEvent.Description = @event.Description;
                    recurringEvent.Location = @event.Location;
                    recurringEvent.Notes = @event.Notes;
                }
            } 

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
        public async Task<ActionResult<Event>> PostEvent(EventViewModel evt)
        {
            await dbContext.Calendars.FindAsync(evt.CalendarId);

            var beginDate = new DateTime(evt.StartYear, evt.StartMonth, evt.StartDay, evt.StartHour, evt.StartMinute, 0);

            var dbEvent = new Event
            {
                Title = evt.Title,
                BeginDate = beginDate,
                Description = evt.Description,
                Location = evt.Location,
                Notes = evt.Notes,
                EventTypeId = evt.EventTypeId,
                IsRecurring = evt.IsRecurring
            };

            if (evt.EndYear > 0)
            {
                var endDate = new DateTime(evt.EndYear, evt.EndMonth, evt.EndDay, evt.EndHour, evt.EndMinute, 0);
                dbEvent.EndDate = endDate;
            }
            dbContext.Events.Add(dbEvent);

            if (evt.IsRecurring)
            {
                dbEvent.RecurrenceId = Guid.NewGuid();

                if (evt.Annualy)
                {
                    for (var i = 0; i < 5; i++)
                    {
                        var startDate = dbEvent.BeginDate.AddYears(1);
                        var recurringEvent = CreateRecurringEvent(dbEvent, startDate);
                        if (evt.EndYear > 0)
                        {
                            var endDate = dbEvent.EndDate?.AddYears(1);
                            recurringEvent.EndDate = endDate;
                        }
                        dbContext.Add(recurringEvent);
                    }
                } else if (evt.Monthly)
                {
                    for (var i = 0; i < 60; i++)
                    {
                        var startDate = dbEvent.BeginDate.AddMonths(1);
                        var recurringEvent = CreateRecurringEvent(dbEvent, startDate);
                        if (evt.EndYear > 0)
                        {
                            var endDate = dbEvent.EndDate?.AddYears(1);
                            recurringEvent.EndDate = endDate;
                        }
                        dbContext.Add(recurringEvent);
                    }
                } else if (evt.Weekly)
                {
                    for (var i = 0; i < 260; i++)
                    {
                        var startDate = dbEvent.BeginDate.AddDays(7);
                        var recurringEvent = CreateRecurringEvent(dbEvent, startDate);
                        if (evt.EndYear > 0)
                        {
                            var endDate = dbEvent.EndDate?.AddYears(1);
                            recurringEvent.EndDate = endDate;
                        }
                        dbContext.Add(recurringEvent);
                    }
                }
            }

            await dbContext.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Event/5/True or False
        [HttpDelete("{id}/{deleteAll}")]
        [Authorize]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<Event>> DeleteEvent(int id, bool deleteAll)
        {
            var @event = await dbContext.Events.FindAsync(id);
            if (@event == null) return NotFound();

            if (@event.IsRecurring && deleteAll)
            {
                var recurringEvents = await dbContext
                    .Events
                    .Where(e => e.RecurrenceId == @event.RecurrenceId && e.BeginDate > @event.BeginDate)
                    .ToListAsync();
                foreach (var recurringEvent in recurringEvents)
                {
                    dbContext.Events.Remove(recurringEvent);
                }
            }
            else
            {
                dbContext.Events.Remove(@event);
            }

            await dbContext.SaveChangesAsync();

            return @event;
        }

        private Event CreateRecurringEvent(Event originalEvent, DateTime nextDate)
        {
            var recurringEvent = new Event
            {
                Title = originalEvent.Title,
                BeginDate = nextDate,
                Description = originalEvent.Description,
                Location = originalEvent.Location,
                Notes = originalEvent.Notes,
                EventTypeId = originalEvent.EventTypeId,
                IsRecurring = originalEvent.IsRecurring,
                RecurrenceId = originalEvent.RecurrenceId
            };

            return recurringEvent;
        }

        private bool EventExists(int id)
        {
            return dbContext.Events.Any(e => e.Id == id);
        }
    }
}

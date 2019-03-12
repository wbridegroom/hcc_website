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

        [HttpGet("types/")]
        public async Task<ActionResult<IEnumerable<EventType>>> GetEventTypes()
        {
            return await dbContext.EventTypes.ToListAsync();
        }

        [HttpPost("eventtype/{id}")]
        [Authorize]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> UpdateEventType(int id, EventType eventType)
        {
            if (id != eventType.Id) return BadRequest();

            dbContext.Entry(eventType).State = EntityState.Modified;

            await dbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("upcoming/{count}")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<List<EventViewModel>>> GetUpcomingEvents(int count)
        {
            var events = await dbContext.Events
                .Include(e => e.EventType)
                .Where(e => e.BeginDate > DateTime.Now)
                .OrderBy(e => e.BeginDate)
                .Take(count).ToListAsync();

            var viewEvents = new List<EventViewModel>();
            foreach (var @event in events)
            {
                viewEvents.Add(new EventViewModel
                {
                    Id = @event.Id,
                    Title = @event.Title,
                    Start = @event.BeginDate,
                    End = @event.EndDate,
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
                    End = @event.EndDate,
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
        public async Task<IActionResult> PutEvent(int id, EventViewModel evt)
        {
            if (id != evt.Id) return BadRequest();

            var dbEvent = await dbContext.Events.FindAsync(id);
            if (dbEvent == null) return NotFound();

            var originalBeginDate = dbEvent.BeginDate;
            var newBeginDate = new DateTime(evt.StartYear, evt.StartMonth, evt.StartDay, evt.StartHour, evt.StartMinute, 0);
            DateTime? newEndDate = null;
            if (evt.HasEndTime)
            {
                newEndDate = new DateTime(evt.StartYear, evt.StartMonth, evt.StartDay, evt.EndHour, evt.EndMinute, 0);
            }

            dbEvent.Title = evt.Title;
            dbEvent.BeginDate = newBeginDate;
            dbEvent.EndDate = newEndDate;
            dbEvent.Description = evt.Description;
            dbEvent.Location = evt.Location;
            dbEvent.Notes = evt.Notes;

            if (dbEvent.IsRecurring && evt.UpdateRecurrence)
            {
                var recurringEvents = await dbContext
                    .Events
                    .Where(e => e.RecurrenceId == evt.RecurrenceId && e.BeginDate > dbEvent.BeginDate)
                    .ToListAsync();
                foreach (var recurringEvent in recurringEvents)
                {
                    var offset = newBeginDate.Subtract(originalBeginDate);
                    recurringEvent.BeginDate = recurringEvent.BeginDate.Add(offset);
                    if (evt.HasEndTime)
                    {
                        var begin = recurringEvent.BeginDate;
                        recurringEvent.EndDate = new DateTime(begin.Year, begin.Month, begin.Day, evt.EndHour, evt.EndMinute, 0);
                    }
                    recurringEvent.Title = evt.Title;
                    recurringEvent.Description = evt.Description;
                    recurringEvent.Location = evt.Location;
                    recurringEvent.Notes = evt.Notes;
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
            DateTime? endDate = null;
            if (evt.HasEndTime)
            {
                endDate = new DateTime(evt.StartYear, evt.StartMonth, evt.StartDay, evt.EndHour, evt.EndMinute, 0);
            }

            var dbEvent = new Event
            {
                Title = evt.Title,
                BeginDate = beginDate,
                EndDate = endDate,
                Description = evt.Description,
                Location = evt.Location,
                Notes = evt.Notes,
                EventTypeId = evt.EventTypeId,
                IsRecurring = evt.IsRecurring,
                AllDay = evt.AllDay || evt.EventTypeId == 4
            };

            dbContext.Events.Add(dbEvent);

            if (evt.IsRecurring)
            {
                dbEvent.RecurrenceId = Guid.NewGuid();

                if (!string.IsNullOrEmpty(evt.RecurrenceType) && evt.RecurrenceType.Equals("annually"))
                {
                    for (var i = 1; i < 5; i++)
                    {
                        var startDate = dbEvent.BeginDate.AddYears(i);
                        var recurringEvent = CreateRecurringEvent(dbEvent, startDate, evt);
                        dbContext.Add(recurringEvent);
                    }
                } else if (!string.IsNullOrEmpty(evt.RecurrenceType) && evt.RecurrenceType.Equals("monthly"))
                {
                    if (!string.IsNullOrEmpty(evt.RecurrenceMonthlyType) && evt.RecurrenceMonthlyType.Equals("date"))
                    {
                        for (var i = 1; i < 60; i++)
                        {
                            var startDate = dbEvent.BeginDate.AddMonths(i);
                            var recurringEvent = CreateRecurringEvent(dbEvent, startDate, evt);
                            dbContext.Add(recurringEvent);
                        }
                    } else if (!string.IsNullOrEmpty(evt.RecurrenceMonthlyType) && evt.RecurrenceMonthlyType.Equals("week"))
                    {
                        var week = evt.RecurrenceMonthlyWeek;
                        
                        var day = dbEvent.BeginDate.DayOfWeek;
                        var date = new DateTime(dbEvent.BeginDate.Year, dbEvent.BeginDate.Month, 1, dbEvent.BeginDate.Hour, dbEvent.BeginDate.Minute, 0);
                        for (var i = 1; i < 60; i++)
                        {
                            var index = 0;
                            var startDate = date.AddMonths(i);
                            var month = startDate.Month;
                            var lastDate = startDate;
                            while (month == startDate.Month)
                            {
                                if (startDate.DayOfWeek == day)
                                {
                                    index++;
                                    lastDate = startDate;
                                    if (index == week) break;
                                }
                                startDate = startDate.AddDays(1);
                            }
                            if (week == 5)
                            {
                                startDate = lastDate;
                            }
                            var recurringEvent = CreateRecurringEvent(dbEvent, startDate, evt);
                            dbContext.Add(recurringEvent);
                        }
                        
                    }
                } else if (!string.IsNullOrEmpty(evt.RecurrenceType) && evt.RecurrenceType.Equals("weekly"))
                {
                    for (var i = 1; i < 260; i++)
                    {
                        var startDate = dbEvent.BeginDate.AddDays(i * 7);
                        var recurringEvent = CreateRecurringEvent(dbEvent, startDate, evt);
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
                    .Where(e => e.RecurrenceId == @event.RecurrenceId && e.BeginDate >= @event.BeginDate)
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

        private Event CreateRecurringEvent(Event originalEvent, DateTime nextDate, EventViewModel evt)
        {
            var recurringEvent = new Event
            {
                Title = originalEvent.Title,
                BeginDate = nextDate,
                Description = originalEvent.Description,
                Location = originalEvent.Location,
                Notes = originalEvent.Notes,
                AllDay = originalEvent.AllDay,
                EventTypeId = originalEvent.EventTypeId,
                IsRecurring = originalEvent.IsRecurring,
                RecurrenceId = originalEvent.RecurrenceId
            };
            if (evt.HasEndTime)
            {
                recurringEvent.EndDate = new DateTime(nextDate.Year, nextDate.Month, nextDate.Day, evt.EndHour, evt.EndMinute, 0);
            }

            return recurringEvent;
        }

        private bool EventExists(int id)
        {
            return dbContext.Events.Any(e => e.Id == id);
        }
    }
}

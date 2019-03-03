using System;
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
    public class PageController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public PageController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        // GET: api/Page
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Page>>> GetPages()
        {
            return await dbContext.Pages.Where(p => p.Parent == null).Include(p => p.Children).ToListAsync();
        }

        // GET: api/Page/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Page>> GetPage(int id)
        {
            var page = await dbContext.Pages.Include(p => p.Parent).ThenInclude(p => p.MenuItem)
                .Include(p => p.MenuItem) 
                .Include(p => p.Children)
                .Include(p => p.PageContents).ThenInclude(pc => pc.TextContent)
                .Include(p => p.PageContents).ThenInclude(pc => pc.TabContent).ThenInclude(tc => tc.Tabs).ThenInclude(t => t.TextContent)
                .Include(p => p.PageContents).ThenInclude(pc => pc.CalendarContent).ThenInclude(cc => cc.Calendar).ThenInclude(c => c.Events)
                .Include(p => p.PageContents).ThenInclude(pc => pc.FileContent).ThenInclude(fc => fc.Files)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (page == null) return NotFound();

            return page;
        }

        // PUT: api/Page/5
        [HttpPut("{id}")]
        [Authorize]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> PutPage(int id, Page page)
        {
            if (id != page.Id)
            {
                return BadRequest();
            }

            dbContext.Entry(page).State = EntityState.Modified;

            try
            {
                await dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PageExists(id)) return NotFound();
                throw;
            }

            return NoContent();
        }

        // POST: api/Page
        [HttpPost]
        [Authorize]
        [ProducesResponseType(201)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<Page>> PostPage(Page page)
        {
            try
            {
                if (page.Parent != null)
                {
                    var parent = await dbContext.Pages.Include(p => p.Children)
                        .FirstOrDefaultAsync(p => p.Id == page.Parent.Id);
                    parent?.Children.Add(page);
                }
                else
                {
                    await dbContext.Pages.AddAsync(page);
                }

                await dbContext.SaveChangesAsync();

                return CreatedAtAction("GetPage", new {id = page.Id}, page);
            }
            catch (Exception e)
            {
                return NotFound(e);
            }
        }

        // DELETE: api/Page/5
        [HttpDelete("{id}")]
        [Authorize]
        [ProducesResponseType(202)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<Page>> DeletePage(int id)
        {
            try
            {
                var page = await dbContext.Pages.FindAsync(id);
                if (page == null)
                {
                    return NotFound();
                }

                dbContext.Pages.Remove(page);
                await dbContext.SaveChangesAsync();

                return page;
            }
            catch (Exception e)
            {
                return NotFound(e);
            }
        }

        private bool PageExists(int id)
        {
            return dbContext.Pages.Any(e => e.Id == id);
        }
    }
}

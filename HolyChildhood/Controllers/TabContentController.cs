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
    public class TabContentController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public TabContentController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        // GET: api/TabContent
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TabContent>>> GetTabContents()
        {
            return await dbContext.TabContents.ToListAsync();
        }

        // GET: api/TabContent/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TabContent>> GetTabContent(int id)
        {
            var tabContent = await dbContext.TabContents.FindAsync(id);

            if (tabContent == null)
            {
                return NotFound();
            }

            return tabContent;
        }

        // PUT: api/TabContent/5
        [HttpPut("{id}")]
        [Authorize]
        [ProducesResponseType(201)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> PutTabContent(int id, TabContent tabContent)
        {
            if (id != tabContent.Id) return BadRequest(); 

            dbContext.Entry(tabContent).State = EntityState.Modified;

            try
            {
                await dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TabContentExists(id)) return NotFound();
                throw;
            }

            return NoContent();
        }

        // POST: api/TabContent
        [HttpPost]
        [Authorize]
        [ProducesResponseType(201)]
        public async Task<ActionResult<TabContent>> PostTabContent(TabContent tabContent)
        {
            dbContext.TabContents.Add(tabContent);
            await dbContext.SaveChangesAsync();

            return CreatedAtAction("GetTabContent", new { id = tabContent.Id }, tabContent);
        }

        // DELETE: api/TabContent/5
        [HttpDelete("{id}")]
        [Authorize]
        [ProducesResponseType(202)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<TabContent>> DeleteTabContent(int id)
        {
            var tabContent = await dbContext.TabContents.FindAsync(id);
            if (tabContent == null)
            {
                return NotFound();
            }

            dbContext.TabContents.Remove(tabContent);
            await dbContext.SaveChangesAsync();

            return tabContent;
        }

        private bool TabContentExists(int id)
        {
            return dbContext.TabContents.Any(e => e.Id == id);
        }
    }
}

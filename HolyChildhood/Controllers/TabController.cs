using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HolyChildhood.Models;

namespace HolyChildhood.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class TabController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public TabController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        // PUT: api/Tab/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTab(int id, Tab tab)
        {
            if (id != tab.Id) return BadRequest();

            dbContext.Entry(tab).State = EntityState.Modified;

            try
            {
                await dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TabExists(id)) return NotFound();
                throw;
            }

            return NoContent();
        }

        // POST: api/Tab
        [HttpPost]
        public async Task<ActionResult<Tab>> PostTab(Tab tab)
        {
            dbContext.Tabs.Add(tab);
            await dbContext.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Tab/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Tab>> DeleteTab(int id)
        {
            var tab = await dbContext.Tabs.FindAsync(id);
            if (tab == null) return NotFound();

            dbContext.Tabs.Remove(tab);
            await dbContext.SaveChangesAsync();

            return tab;
        }

        private bool TabExists(int id)
        {
            return dbContext.Tabs.Any(e => e.Id == id);
        }
    }
}

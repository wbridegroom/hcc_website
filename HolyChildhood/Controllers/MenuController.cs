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
    public class MenuController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public MenuController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        // GET: api/Menu
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MenuItem>>> GetMenuItems()
        {
            var menuItems = dbContext.MenuItems.Include(m => m.Pages).ToList();
            menuItems.ForEach(m => m.Pages = m.Pages.OrderBy(p => p.Index).ToList());
            return menuItems;
        }

        // GET: api/Menu/5
        [HttpGet("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<MenuItem>> GetMenuItem(int id)
        {
            var menuItem = await dbContext.MenuItems.FindAsync(id);

            if (menuItem == null) return NotFound();

            return menuItem;
        }

        // PUT: api/Menu/5
        [HttpPut("{id}")]
        [Authorize]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> PutMenuItem(int id, MenuItem menuItem)
        {
            if (id != menuItem.Id) return BadRequest();

            dbContext.Entry(menuItem).State = EntityState.Modified;
            foreach(var page in menuItem.Pages)
            {
                dbContext.Entry(page).State = EntityState.Modified;
            }

            try
            {
                await dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MenuItemExists(id)) return NotFound();
                throw;
            }

            return NoContent();
        }

        // POST: api/Menu
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<MenuItem>> PostMenuItem(MenuItem menuItem)
        {
            dbContext.MenuItems.Add(menuItem);
            await dbContext.SaveChangesAsync();

            return CreatedAtAction("GetMenuItem", new { id = menuItem.Id }, menuItem);
        }

        // DELETE: api/Menu/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult<MenuItem>> DeleteMenuItem(int id)
        {
            var menuItem = await dbContext.MenuItems.FindAsync(id);
            if (menuItem == null)
            {
                return NotFound();
            }

            dbContext.MenuItems.Remove(menuItem);
            await dbContext.SaveChangesAsync();

            return menuItem;
        }

        private bool MenuItemExists(int id)
        {
            return dbContext.MenuItems.Any(e => e.Id == id);
        }
    }
}

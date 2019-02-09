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
    public class TextContentController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public TextContentController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        // GET: api/TextContent
        [HttpGet]
        [ProducesResponseType(200)]
        public async Task<ActionResult<IEnumerable<TextContent>>> GetTextContents()
        {
            return await dbContext.TextContents.ToListAsync();
        }

        // GET: api/TextContent/5
        [HttpGet("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<TextContent>> GetTextContent(int id)
        {
            var textContent = await dbContext.TextContents.FindAsync(id);

            if (textContent == null)
            {
                return NotFound();
            }

            return textContent;
        }

        // PUT: api/TextContent/5
        [HttpPut("{id}")]
        [Authorize]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> PutTextContent(int id, TextContent textContent)
        {
            if (id != textContent.Id) return BadRequest();

            // Create Backup
            var textContentDb = await dbContext.TextContents.FindAsync(id);
            if (textContentDb == null) return NoContent();

            var backup = new TextContentBackup
            {
                TextContent = textContentDb,
                Content = textContentDb.Content,
                CreationDate = DateTime.Now
            };
            await dbContext.TextContentsBackup.AddAsync(backup);

            textContentDb.Content = textContent.Content;
            try
            {
                await dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TextContentExists(id)) return NotFound();
                throw;
            }

            return NoContent();
        }

        // POST: api/TextContent
        [HttpPost]
        [Authorize]
        [ProducesResponseType(201)]
        public async Task<ActionResult<TextContent>> PostTextContent(TextContent textContent)
        {
            dbContext.TextContents.Add(textContent);
            await dbContext.SaveChangesAsync();

            return CreatedAtAction("GetTextContent", new { id = textContent.Id }, textContent);
        }

        // DELETE: api/TextContent/5
        [HttpDelete("{id}")]
        [Authorize]
        [ProducesResponseType(202)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<TextContent>> DeleteTextContent(int id)
        {
            var textContent = await dbContext.TextContents.FindAsync(id);
            if (textContent == null)
            {
                return NotFound();
            }

            dbContext.TextContents.Remove(textContent);
            await dbContext.SaveChangesAsync();

            return textContent;
        }

        private bool TextContentExists(int id)
        {
            return dbContext.TextContents.Any(e => e.Id == id);
        }
    }
}

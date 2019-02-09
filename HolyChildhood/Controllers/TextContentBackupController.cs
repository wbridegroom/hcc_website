using System;
using System.Collections;
using System.Linq;
using System.Threading.Tasks;
using HolyChildhood.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HolyChildhood.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TextContentBackupController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public TextContentBackupController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable>> GetTextContentBackups(int id)
        {
            return await dbContext.TextContentsBackup.Where(pcb => pcb.TextContent.Id == id)
                .Select(tcb => new
                {
                    tcb.Id,
                    tcb.CreationDate,
                    DisplayDate = tcb.CreationDate.ToString("MMMM dd, yyyy hh:mm:ss tt")
                }).OrderByDescending(pcb => pcb.CreationDate).ToListAsync();
        }

        [HttpPost("{id}")]
        [Authorize]
        [ProducesResponseType(201)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<TextContent>> Restore(int id)
        {
            var backup = await dbContext.TextContentsBackup.FindAsync(id);
            if (backup == null) return NotFound();
            
            var content = backup.Content;
            var textContent = await dbContext.TextContents.FindAsync(backup.TextContentId);
            if (textContent == null) return NotFound();
            
            backup.Content = textContent.Content;
            backup.CreationDate = DateTime.Now;
            textContent.Content = content;

            await dbContext.SaveChangesAsync();

            return textContent;
        }
    }
}
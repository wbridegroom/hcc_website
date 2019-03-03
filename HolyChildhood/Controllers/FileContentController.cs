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
    public class FileContentController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public FileContentController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        // PUT: api/FileContent/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFileContent(int id, FileContent fileContent)
        {
            if (id != fileContent.Id) return BadRequest();

            dbContext.Entry(fileContent).State = EntityState.Modified;

            try
            {
                await dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FileContentExists(id)) return NotFound();
                throw;
            }

            return NoContent();
        }

        // POST: api/FileContent
        [HttpPost]
        public async Task<IActionResult> PostFileContent(FileContent fileContent)
        {
            dbContext.FileContents.Add(fileContent);
            await dbContext.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/FileContent/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<FileContent>> DeleteFileContent(int id)
        {
            var fileContent = await dbContext.FileContents.FindAsync(id);
            if (fileContent == null) return NotFound();

            dbContext.FileContents.Remove(fileContent);
            await dbContext.SaveChangesAsync();

            return fileContent;
        }

        private bool FileContentExists(int id)
        {
            return dbContext.FileContents.Any(e => e.Id == id);
        }
    }
}

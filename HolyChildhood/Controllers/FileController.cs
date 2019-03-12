using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HolyChildhood.Models;
using File = HolyChildhood.Models.File;

namespace HolyChildhood.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : Controller
    {
        private readonly AppDbContext dbContext;

        public FileController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        // GET: api/File
        [HttpGet]
        [ProducesResponseType(200)]
        public async Task<ActionResult<IEnumerable<File>>> GetFiles()
        {
            return await dbContext.Files.OrderByDescending(f => f.CreatedAt).ToListAsync();
        }

        // GET: api/File/5
        [HttpGet("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<IEnumerable<File>>> GetFilesByContentId(int id)
        {
            return await dbContext.Files.Where(f => f.FileContentId == id).OrderByDescending(f => f.CreatedAt).ToListAsync();
        }

        // POST: api/File
        [HttpPost]
        [ProducesResponseType(201)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<File>> Upload()
        {
            var request = HttpContext.Request;
            var count = request.Form.Files.Count;
            if (count == 0) return NotFound();

            var file = request.Form.Files.GetFile("files");
            if (file == null) return NotFound();

            var extension = file.FileName.Substring(file.FileName.LastIndexOf('.') + 1);
            var title = request.Form["name"].ToString();
            var date = request.Form["date"].ToString();
            var fileContentIdStr = request.Form["fileContentId"];

            var dbFile = new Models.File
            {
                Title = title,
                Type = extension,
                CreatedAt = DateTime.Parse(date),
                FileContentId = int.Parse(fileContentIdStr)
            };
            await dbContext.Files.AddAsync(dbFile);
            await dbContext.SaveChangesAsync();

            var name = dbFile.Id + "." + extension;
            var path = new FileInfo("wwwroot/files/" + name);
            path.Directory?.Create();

            var stream = new MemoryStream();
            file.CopyTo(stream);
            stream.Position = 0;

            var writer = System.IO.File.Create(path.FullName);
            stream.CopyTo(writer);
            writer.Dispose();

            return Json(new { link = "/files/" + name });
        }

        // DELETE: api/File/5
        [HttpDelete("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<File>> DeleteFile(int id)
        {
            var dbFile = await dbContext.Files.FindAsync(id);
            if (dbFile == null) return NotFound();

            var path = "wwwroot/files/" + dbFile.Id + "." + dbFile.Type;
            if (System.IO.File.Exists(path))
            {
                System.IO.File.Delete(path);
            }

            dbContext.Files.Remove(dbFile);
            await dbContext.SaveChangesAsync();

            return NoContent();
        }
    }
}

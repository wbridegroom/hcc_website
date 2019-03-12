using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace HolyChildhood.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class EmbeddedFileController : Controller
    {
        [HttpPost]
        [ProducesResponseType(201)]
        [ProducesResponseType(404)]
        public async Task<ActionResult> Upload()
        {
            var request = HttpContext.Request;

            var filesCount = request.Form.Files.Count;
            if (filesCount == 0) return NotFound();

            var file = request.Form.Files.GetFile("file");
            if (file == null) return NotFound();

            var name = file.FileName;
            var dir = new FileInfo("wwwroot/files/" + name);
            dir.Directory?.Create();

            var stream = new MemoryStream();
            file.CopyTo(stream);
            stream.Position = 0;

            var writer = System.IO.File.Create(dir.FullName);
            stream.CopyTo(writer);
            writer.Dispose();

            return Json(new {link = "/files/" + name});
        }
    }
}
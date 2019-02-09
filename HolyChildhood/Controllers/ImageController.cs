using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace HolyChildhood.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : Controller
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

            var name = GenerateFileName(file.FileName);
            var dir = new FileInfo("wwwroot/images/" + name);
            dir.Directory?.Create();

            var stream = new MemoryStream();
            file.CopyTo(stream);
            stream.Position = 0;

            var writer = System.IO.File.Create(dir.FullName);
            stream.CopyTo(writer);
            writer.Dispose();

            return Json(new {link = "/images/" + name});
        }

        [HttpGet]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult> Load()
        {
            var response = new List<object>();
            const string path = "wwwroot/images";

            var fileEntries = Directory.GetFiles(path);
            foreach (var fileEntry in fileEntries)
            {
                var fileName = Path.GetFileName(fileEntry);
                if (System.IO.File.Exists(fileEntry))
                {
                    response.Add(new
                    {
                        url = "images/" + fileName
                    });
                }
            }

            return Json(response);
        }

        [HttpDelete]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult> Delete()
        {
            var request = HttpContext.Request;
            
            if (!request.Form.ContainsKey("src")) return NotFound();

            var src = request.Form["src"];
            var path = "wwwroot/" + src;

            if (!System.IO.File.Exists(path)) return NotFound();

            System.IO.File.Delete(path);

            return NoContent();
        }

        private static string GenerateFileName(string fileName)
        {
            var extension = fileName.Substring(fileName.LastIndexOf('.') + 1);
            var sha1 = SHA1.Create();
            var hashBytes = sha1.ComputeHash(Encoding.UTF8.GetBytes((DateTime.Now.Ticks / TimeSpan.TicksPerMillisecond).ToString()));
            var sb = new StringBuilder();
            foreach (var b in hashBytes)
            {
                var hex = b.ToString("x2");
                sb.Append(hex);
            }
            return sb + "." + extension;
        }
    }
}
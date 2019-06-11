using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using HolyChildhood.Models;
using HolyChildhood.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HolyChildhood.Controllers
{
    [Produces("appication/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class FormController : ControllerBase
    {
        private readonly AppDbContext dbContext;
        private readonly IConfiguration config;

        public FormController(AppDbContext dbContext, IConfiguration config)
        {
            this.dbContext = dbContext;
            this.config = config;
        }

        [HttpPost("inquire/")]
        public async Task<IActionResult> SubmitInquireForm(InquireFormViewModel inquireForm)
        {
            var client = new SmtpClient();
            var credentials = new NetworkCredential
            {
                UserName = "apikey",
                Password = config.GetValue<string>("SendGridAPIKey")
            };
            client.Credentials = credentials;
            client.Host = "smtp.sendgrid.net";
            client.Port = 25;
            
            var email = new MailMessage();
            email.To.Add(new MailAddress(config.GetValue<string>("InquireEmail")));
            email.From = new MailAddress("website@holychildhoodchurch.com");
            email.Subject = "Website Inquiry";
            email.IsBodyHtml = true;
            email.Body = ComposeBody(inquireForm);
            
            client.Send(email);

            return NoContent();
        }

        private string ComposeBody(InquireFormViewModel inquireForm)
        {
            var body = new StringBuilder();
            body.Append("<html>");
            body.Append("<body>");
            body.Append("<div>");
            body.Append("<h2>HCC Website Inquiry</h2>");
            body.Append("<table border=0 cellspacing=0 cellpadding=0>");

            body.Append(AddRow("First Name", inquireForm.FirstName));
            body.Append(AddRow("Middle Name", inquireForm.MiddleName));
            body.Append(AddRow("Last Name", inquireForm.LastName));

            var address = string.Empty;
            if (!string.IsNullOrEmpty(inquireForm.Street) && 
                !string.IsNullOrEmpty(inquireForm.City) &&
                !string.IsNullOrEmpty(inquireForm.State) && 
                !string.IsNullOrEmpty(inquireForm.ZipCode))
            {
                address = inquireForm.Street + "<br />";
                address += inquireForm.City + ", " + inquireForm.State + " " + inquireForm.ZipCode;
            }
            body.Append(AddRow("Address", address));
            body.Append(AddRow("Home Phone", inquireForm.HomePhone));
            body.Append(AddRow("Cell Phone", inquireForm.MobilePhone));
            body.Append(AddRow("Email", inquireForm.EmailAddress));

            if (inquireForm.HasChildren && inquireForm.Children.Count > 0)
            {
                var childTable = new StringBuilder();
                childTable.Append("<table border=1 cellspacing=0 cellpadding=0 width=600>");
                childTable.Append("<tr>");
                childTable.Append("  <td width=265 valign=top style='padding:0in 5.4pt 0in 5.4pt'>");
                childTable.Append("    <b>Name</b>");
                childTable.Append("  </td>");
                childTable.Append("  <td width=85 valign=top style='padding:0in 5.4pt 0in 5.4pt'>");
                childTable.Append("    <b>DOB</b>");
                childTable.Append("  </td>");
                childTable.Append("  <td width=162 valign=top style='padding:0in 5.4pt 0in 5.4pt'>");
                childTable.Append("    <b>School</b>");
                childTable.Append("  </td>");
                childTable.Append("  <td width=72 valign=top style='padding:0in 5.4pt 0in 5.4pt'>");
                childTable.Append("    <b>Grade</b>");
                childTable.Append("  </td>");
                childTable.Append("</tr>");

                foreach (var child in inquireForm.Children)
                {
                    childTable.Append(AddChildren(child));
                }

                childTable.Append("</table>");

                body.Append(AddRow("Children", childTable.ToString()));
            }
            if (inquireForm.TalkToPastor)
            {
                body.Append(AddRow("Talk to Fr Paul", "Yes"));
                body.Append(AddRow("Best Time to Call", inquireForm.BestTimeDay));
            }
            if (inquireForm.Interests.Count > 0)
            {
                var interests = string.Empty;
                foreach (var interest in inquireForm.Interests)
                {
                    interests += interest + "<br />";
                }

                if (!string.IsNullOrEmpty(interests))
                {
                    body.Append(AddRow("Interested In", interests));
                }
            }
            if (!string.IsNullOrEmpty(inquireForm.HeardHow))
            {
                if (inquireForm.HeardHow.Equals("Other") && !string.IsNullOrEmpty(inquireForm.HeardHowOther))
                {
                    body.Append(AddRow("Heard About From", inquireForm.HeardHowOther));
                } else
                {
                    body.Append(AddRow("Heard About From", inquireForm.HeardHow));
                }
            }
            if (!string.IsNullOrEmpty(inquireForm.Comments))
            {
                body.Append("<tr>");
                body.Append("  <td width=772 colspan=2 valign=top style='padding:0in 5.4pt 0in 5.4pt'>");
                body.Append("    <b>Questions/Comments</b>");
                body.Append("  </td>");
                body.Append("</tr>");
                body.Append("<tr>");
                body.Append("  <td width=772 colspan=2 valign=top style='padding:0in 5.4pt 0in 5.4pt'>");
                body.Append(inquireForm.Comments);
                body.Append("  </td>");
                body.Append("</tr>");
            }
            
            body.Append("</table>");
            body.Append("</div>");
            body.Append("</body>");
            body.Append("</html>");

            return body.ToString();
        }

        private string AddChildren(Child child)
        {
            var childRow = new StringBuilder();

            childRow.Append("<tr>");
            childRow.Append("  <td width=265 valign=top style='padding:0in 5.4pt 0in 5.4pt'>");
            if (!string.IsNullOrEmpty(child.FirstName))
            {
                childRow.Append(child.FirstName).Append(" ");
            }
            if (!string.IsNullOrEmpty(child.MiddleName))
            {
                childRow.Append(child.MiddleName).Append(" ");
            }
            if (!string.IsNullOrEmpty(child.LastName))
            {
                childRow.Append(child.LastName);
            }
            childRow.Append("  </td>");
            childRow.Append("  <td width=85 valign=top style='padding:0in 5.4pt 0in 5.4pt'>");
            if (!string.IsNullOrEmpty(child.Birthday))
            {
                childRow.Append(child.Birthday);
            }
            childRow.Append("  </td>");
            childRow.Append("  <td width=162 valign=top style='padding:0in 5.4pt 0in 5.4pt'>");
            if (!string.IsNullOrEmpty(child.School))
            {
                childRow.Append(child.School);
            }
            childRow.Append("  </td>");
            childRow.Append("  <td width=72 valign=top style='padding:0in 5.4pt 0in 5.4pt'>");
            if (!string.IsNullOrEmpty(child.Grade))
            {
                childRow.Append(child.Grade);
            }
            childRow.Append("  </td>");
            childRow.Append("</tr>");

            return childRow.ToString();
        }

        private string AddRow(string header, string value)
        {
            var row = new StringBuilder();
            row.Append("  <tr>");
            row.Append("    <td width=148 valign=top style='width:110.9pt;padding:0in 5.4pt 0in 5.4pt'>");
            row.Append("      <b>").Append(header).Append("</b>");
            row.Append("    </td>");
            row.Append("    <td width=624 valign=top style='width:6.5in;padding:0in 5.4pt 0in 5.4pt'>");
            if (!string.IsNullOrEmpty(value))
            {
                row.Append(value);
            }
            row.Append("    </td>");
            row.Append("  </tr>");

            return row.ToString();
        }

        // GET api/values/5
        //[HttpGet("{id}")]
        //[ProducesResponseType(200)]
        //[ProducesResponseType(404)]
        //public async Task<ActionResult<Form>> GetForm(int id)
        //{
        //    var form = await dbContext.Forms.Include(f => f.FormRows)
        //                                    .ThenInclude(fr => fr.FormElements)
        //                                    .ThenInclude(fe => fe.FormElementValues)
        //                                    .FirstOrDefaultAsync(f => f.Id == id);

        //    if (form == null) return NotFound();
        //    return form;
        //}

        // POST api/values
        //[HttpPost]
        //[Authorize]
        //[ProducesResponseType(201)]
        //public async Task<ActionResult<Form>> PostForm(Form form)
        //{
        //    dbContext.Forms.Add(form);
        //    await dbContext.SaveChangesAsync();

        //    return CreatedAtAction("GetForm", new { id = form.Id }, form);
        //}

        // PUT api/values/5
        //[HttpPut("{id}")]
        //[Authorize]
        //[ProducesResponseType(204)]
        //[ProducesResponseType(400)]
        //[ProducesResponseType(404)]
        //public async Task<IActionResult> PutForm(int id, Form form)
        //{
        //    if (id != form.Id) return BadRequest();

        //    dbContext.Entry(form).State = EntityState.Modified;

        //    try
        //    {
        //        await dbContext.SaveChangesAsync();
        //    } catch (DbUpdateException)
        //    {
        //        if (!dbContext.Forms.Any(f => f.Id == id))
        //        {
        //            return NotFound();
        //        }
        //        throw;
        //    }
        //    return NoContent();
        //}

        //[HttpPost("{id}/row")]
        //public void AddFormRow(int id, FormRow row)
        //{

        //}

        //[HttpPut("{id}/row/{rowId}")]
        //public void UpdateFormRow(int id, int rowId, FormRow row)
        //{

        //}

        //[HttpDelete("{id}/row/{rowId}")]
        //public void DeleteFormRow(int id, int rowId)
        //{

        //}

        //[HttpPost("{id}/row/{rowId}/element")]
        //public void AddFormElement(int id, int rowId, FormElement element)
        //{

        //}

        //[HttpPut("{id}/row/{rowId}/element/{elementId}")]
        //public void UpdateFormElement(int id, int rowId, int elementId, FormElement element)
        //{

        //}

        //[HttpDelete("{id}/row/{rowId}/element/{elementId}")]
        //public void DeleteFormElement(int id, int rowId, int elementId)
        //{

        //}

        // DELETE api/values/5
        //[HttpDelete("{id}")]
        //[Authorize]
        //[ProducesResponseType(200)]
        //[ProducesResponseType(404)]
        //public async Task<ActionResult<Form>> DeleteForm(int id)
        //{
        //    var form = await dbContext.Forms.FindAsync(id);
        //    if (form == null) return NotFound();

        //    dbContext.Forms.Remove(form);
        //    await dbContext.SaveChangesAsync();

        //    return form;
        //}
    }
}

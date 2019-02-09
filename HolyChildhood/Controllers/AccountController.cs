using System;
using System.Linq;
using System.Threading.Tasks;
using HolyChildhood.Models;
using HolyChildhood.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace HolyChildhood.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> userManager;

        public AccountController(UserManager<AppUser> userManager)
        {
            this.userManager = userManager;
        }

        [HttpPost]
        [Authorize]
        [ProducesResponseType(201)]
        public async Task<ActionResult> Create(UserViewModel user)
        {
            var appUser = new AppUser
            {
                UserName = user.UserName,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email
            };
            await userManager.CreateAsync(appUser, user.Password);
            foreach (var role in user.Roles)
            {
                await userManager.AddToRoleAsync(appUser, role);
            }

            return NoContent();
        }

        [HttpPut]
        [Authorize]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<ActionResult> Update(UserViewModel user)
        {
            try
            {
                var appUser = await userManager.FindByNameAsync(user.UserName);
                if (appUser == null)
                {
                    return NotFound();
                }

                appUser.Title = user.Title;
                appUser.UserName = user.UserName;
                appUser.FirstName = user.FirstName;
                appUser.LastName = user.LastName;
                appUser.MiddleInitial = user.MiddleInitial;
                appUser.Email = user.Email;

                await userManager.UpdateAsync(appUser);

                var roles = new [] {"Administrator", "Editor", "Member"};
                foreach (var role in roles)
                {
                    if (user.Roles.Contains(role))
                    {
                        if (!await userManager.IsInRoleAsync(appUser, role))
                        {
                            userManager.AddToRoleAsync(appUser, role);
                        }
                    }
                    else
                    {
                        if (await userManager.IsInRoleAsync(appUser, role))
                        {
                            userManager.RemoveFromRoleAsync(appUser, role);
                        }
                    }
                }
            }
            catch (Exception e)
            {
                return NotFound(e);
            }

            return NoContent();
        }

        [HttpDelete("{userName}")]
        [Authorize]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<ActionResult> Delete(string userName)
        {
            try
            {
                var appUser = await userManager.FindByNameAsync(userName);
                if (appUser == null)
                {
                    return NotFound();
                }
                await userManager.DeleteAsync(appUser);
            }
            catch (Exception e)
            {
                return NotFound(e);
            }

            return NoContent();
        }

    }
}
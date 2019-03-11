using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HolyChildhood.Models;
using HolyChildhood.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HolyChildhood.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> userManager;
        private readonly AppDbContext dbContext;

        public AccountController(UserManager<AppUser> userManager, AppDbContext dbContext)
        {
            this.userManager = userManager;
            this.dbContext = dbContext;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<UserViewModel>>> GetUsers()
        {
            var users = await dbContext.Users.ToListAsync();
            var userList = new List<UserViewModel>();
            foreach (var user in users)
            {
                var appUser = await userManager.FindByNameAsync(user.UserName);
                var roles = await userManager.GetRolesAsync(appUser);
                userList.Add(new UserViewModel
                {
                    Title = user.Title,
                    FirstName = user.FirstName,
                    MiddleInitial = user.MiddleInitial,
                    LastName = user.LastName,
                    Email = user.Email,
                    UserName = user.UserName,
                    PhoneNumber = user.PhoneNumber,
                    Roles = roles.ToArray<string>()
                });
            }

            return userList;
        }

        [HttpGet("{username}")]
        [Authorize]
        public async Task<ActionResult<UserViewModel>> GetUser(string username)
        {
            var appUser = await userManager.FindByNameAsync(username);
            var roles = await userManager.GetRolesAsync(appUser);
            var user = new UserViewModel
            {
                Title = appUser.Title,
                FirstName = appUser.FirstName,
                MiddleInitial = appUser.MiddleInitial,
                LastName = appUser.LastName,
                Email = appUser.Email,
                UserName = appUser.UserName,
                PhoneNumber = appUser.PhoneNumber,
                Roles = roles.ToArray<string>()
            };
            return user;
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
            var createUser = userManager.CreateAsync(appUser, user.Password);
            createUser.Wait();

            if (createUser.Result.Succeeded)
            {
                foreach (var role in user.Roles)
                {
                    await userManager.AddToRoleAsync(appUser, role);
                }
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
                            await userManager.AddToRoleAsync(appUser, role);
                        }
                    }
                    else
                    {
                        if (await userManager.IsInRoleAsync(appUser, role))
                        {
                            await userManager.RemoveFromRoleAsync(appUser, role);
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
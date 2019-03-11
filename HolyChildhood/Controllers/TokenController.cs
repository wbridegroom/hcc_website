using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using HolyChildhood.Models;
using HolyChildhood.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace HolyChildhood.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        private readonly UserManager<AppUser> userManager;
        private readonly IConfiguration config;

        public TokenController(UserManager<AppUser> userManager, IConfiguration config)
        {
            this.userManager = userManager;
            this.config = config;
        }

        [HttpPost("Auth")]
        public async Task<ActionResult<TokenResponseViewModel>> Jwt([FromBody] TokenRequestViewModel model)
        {
            if (model == null) return new StatusCodeResult(500);

            switch (model.GrantType)
            {
                case "password":
                    return await GetToken(model);
                default:
                    return new UnauthorizedResult();
            }
        }

        private async Task<ActionResult<TokenResponseViewModel>> GetToken(TokenRequestViewModel model)
        {
            try
            {
                var user = await userManager.FindByNameAsync(model.UserName);
                if (user == null && model.UserName.Contains("@"))
                {
                    user = await userManager.FindByEmailAsync(model.UserName);
                }

                if (user == null || !await userManager.CheckPasswordAsync(user, model.Password))
                {
                    return new UnauthorizedResult();
                }

                var roles = await userManager.GetRolesAsync(user);

                var now = DateTime.UtcNow;
                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(JwtRegisteredClaimNames.Iat, new DateTimeOffset(now).ToUnixTimeSeconds().ToString())
                };

                var tokenExpirationMins = config.GetValue<int>("Auth:Jwt:TokenExpirationInMinutes");
                var issuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Auth:Jwt:Key"]));
                var token = new JwtSecurityToken(
                    issuer: config["Auth:Jwt:Issuer"],
                    audience: config["Auth:Jwt:Audience"],
                    claims: claims,
                    notBefore: now,
                    expires: now.Add(TimeSpan.FromMinutes(tokenExpirationMins)),
                    signingCredentials: new SigningCredentials(issuerSigningKey, SecurityAlgorithms.HmacSha256)
                );
                var encodedToken = new JwtSecurityTokenHandler().WriteToken(token);
                var response = new TokenResponseViewModel
                {
                    Token = encodedToken,
                    Expiration = tokenExpirationMins,
                    UserName = user.UserName,
                    FullName = $"{user.FirstName} {user.LastName}",
                    Roles = roles.ToArray<string>()
                };
                return response;
            }
            catch (Exception ex)
            {
                return new UnauthorizedResult();
            }
        }
    }
}
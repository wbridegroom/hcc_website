using Microsoft.AspNetCore.Identity;

namespace HolyChildhood.Models
{
    public class AppUser : IdentityUser
    {
        public string Title { get; set; }
        public string FirstName { get; set; }
        public string MiddleInitial { get; set; }
        public string LastName { get; set; }

    }
}
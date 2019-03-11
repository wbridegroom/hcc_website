namespace HolyChildhood.ViewModels
{
    public class TokenResponseViewModel
    {
        public string Token { get; set; }
        public int Expiration { get; set; }
        public string UserName { get; set; }
        public string FullName { get; set; }
        public string[] Roles { get; set; }
    }
}
using System;

namespace HolyChildhood.Models
{
    public class File
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string Type { get; set; }

        public DateTime CreatedAt { get; set; }
        public int FileContentId { get; set; }
    }
}
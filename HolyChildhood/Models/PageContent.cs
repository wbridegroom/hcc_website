using System;
using System.Collections.Generic;

namespace HolyChildhood.Models
{
    public class PageContent
    {
        public int Id { get; set; }
        public string ContentType { get; set; }
        public bool HasTitle { get; set; }
        public string Title { get; set; }
        public int Index { get; set; }
        public int PageId { get; set; }
        public TextContent TextContent { get; set; }
        public CalendarContent CalendarContent { get; set; }
        public TabContent TabContent { get; set; }
        public FileContent FileContent { get; set; }
        public Page Page { get; set; }
    }

    public class TextContent
    {
        public int Id { get; set; }
        public string Content { get; set; }
    }

    public class CalendarContent
    {
        public int Id { get; set; }
        public int CalendarId { get; set; }
        public Calendar Calendar { get; set; }
    }

    public class FileContent
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string FileType { get; set; }
        public List<File> Files { get; set; }
    }

    public class TabContent
    {
        public int Id { get; set; }
        public List<Tab> Tabs { get; set; }   
    }

    public class Tab
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int Index { get; set; }
        public int TabContentId { get; set; }
        public TabContent TabContent { get; set; }
        public TextContent TextContent { get; set; }
    }

    public class TextContentBackup
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime CreationDate { get; set; }
        public int TextContentId { get; set; }
        public TextContent TextContent { get; set; }
    }
}
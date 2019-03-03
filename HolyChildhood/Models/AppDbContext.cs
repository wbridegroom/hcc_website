using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace HolyChildhood.Models
{
    public class AppDbContext : IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions options) : base (options) { }

        public DbSet<MenuItem> MenuItems { get; set; }
        public DbSet<Page> Pages { get; set; }
        public DbSet<PageContent> PageContents { get; set; }
        public DbSet<TextContent> TextContents { get; set; }
        public DbSet<FileContent> FileContents { get; set; }
        public DbSet<TabContent> TabContents { get; set; }
        public DbSet<Tab> Tabs { get; set; }
        public DbSet<CalendarContent> CalendarContents { get; set; }
        public DbSet<TextContentBackup> TextContentsBackup { get; set; }

        public DbSet<Calendar> Calendars { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<EventType> EventTypes { get; set; }

        public DbSet<File> Files { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<PageContent>().Property(pc => pc.ContentType).HasDefaultValue("Text");
            builder.Entity<PageContent>().HasOne(pc => pc.Page).WithMany(p => p.PageContents)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<TextContent>().HasMany<TextContentBackup>().WithOne(tcb => tcb.TextContent).OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Tab>().HasOne(t => t.TabContent).WithMany(tc => tc.Tabs).OnDelete(DeleteBehavior.Cascade);
            
            base.OnModelCreating(builder);
        }
    }
}
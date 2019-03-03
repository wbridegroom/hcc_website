using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HolyChildhood.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.IdentityModel.Tokens;

namespace HolyChildhood
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        public IHostingEnvironment Environment { get; }

        public Startup(IConfiguration configuration, IHostingEnvironment env)
        {
            Configuration = configuration;
            Environment = env;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2).AddJsonOptions(
                options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);

            services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
            });

            // Automatically perform database migration
            services.BuildServiceProvider().GetService<AppDbContext>().Database.Migrate();

            services.AddIdentity<AppUser, IdentityRole>(opts =>
            {
                opts.Password.RequireDigit = true;
                opts.Password.RequireLowercase = true;
                opts.Password.RequireUppercase = true;
                opts.Password.RequireNonAlphanumeric = false;
                opts.Password.RequiredLength = 7;
            }).AddEntityFrameworkStores<AppDbContext>();

            services.AddAuthentication(opts =>
            {
                opts.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                opts.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opts.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(cfg =>
            {
                cfg.RequireHttpsMetadata = false;
                cfg.SaveToken = true;
                cfg.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = Configuration["Auth:jwt:Issuer"],
                    ValidAudience = Configuration["Auth:Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Auth:Jwt:Key"])),
                    ClockSkew = TimeSpan.Zero,
                    RequireExpirationTime = true,
                    ValidateIssuer = true,
                    ValidateIssuerSigningKey = true,
                    ValidateAudience = true
                };
            });

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, IServiceProvider serviceProvider, AppDbContext db)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                // app.UseHsts();
            }

            app.UseAuthentication();
            //app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    // spa.UseAngularCliServer(npmScript: "start");
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
                }
            });

            CreateRoles(serviceProvider);
            CreateEventTypes(db);
        }

        private void CreateEventTypes(AppDbContext db)
        {
            var eventTypes = db.EventTypes.ToList();
            if (eventTypes.Count == 0)
            {
                db.EventTypes.Add(new EventType { Name = "Regular", Color = "Blue" });
                db.EventTypes.Add(new EventType { Name = "Meeting", Color = "Red" });
                db.EventTypes.Add(new EventType { Name = "Mass", Color = "Green" });
                db.EventTypes.Add(new EventType { Name = "Holiday", Color = "Gray" });
                db.SaveChanges();
            }
        }

        private void CreateRoles(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<AppUser>>();

            var hasAdminRole = roleManager.RoleExistsAsync("Administrator");
            hasAdminRole.Wait();

            if (hasAdminRole.Result) return;

            var roleResult = roleManager.CreateAsync(new IdentityRole("Administrator"));
            roleResult.Wait();

            roleResult = roleManager.CreateAsync(new IdentityRole("Editor"));
            roleResult.Wait();

            roleResult = roleManager.CreateAsync(new IdentityRole("Member"));
            roleResult.Wait();

            var administrator = new AppUser
            {
                UserName = Configuration.GetValue<string>("AdminUserName"),
                Email = Configuration.GetValue<string>("AdminEmail"),
                FirstName = "System",
                LastName = "Administrator"
            };

            var password = Configuration.GetValue<string>("AdminPassword");
            var createAdmin = userManager.CreateAsync(administrator, password);
            createAdmin.Wait();

            if (!createAdmin.Result.Succeeded) return;

            var addRole = userManager.AddToRoleAsync(administrator, "Administrator");
            addRole.Wait();
        }
    }
}

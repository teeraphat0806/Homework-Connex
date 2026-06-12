using Homework.Domain.Interfaces.RawSqlServices;
using Homework.Domain.Interfaces.Services.PermissionServices;
using Homework.Service.ImplementServices.RawSqlServices;
using Homework.Service.ImplementServices.Authentications.Repositories;
using Homework.Domain.Interfaces.Services.AuthenticationServices;
using Homework.Domain.Models;
using Homework.Domain.ValidateModels.AuthenticationValidateModels;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Reflection;
using System.Text;
using Web.Homework.ExceptionHandler;
using Web.Homework.ExceptionMiddleware;
using Homework.Domain.Error;

namespace Homework.Web
{
    internal class Program
    {
        private static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Auto Register DI
            RegisterDIForCustomerService(builder);

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddScoped<IRawSqlService, RawSqlService>();
            builder.Services.AddScoped<CustomError>();

            // Add CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    builder =>
                    {
                        builder
                        .WithOrigins("http://localhost:4200", "https://localhost:4200")
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials();
                    });
            });

            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            builder.Services.AddHttpContextAccessor();
            builder.Services.AddDbContext<postgresContext>(options =>
                options.UseNpgsql(connectionString));

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultForbidScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = builder.Configuration["JwtConfig:Issuer"],
                    ValidAudience = builder.Configuration["JwtConfig:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(builder.Configuration["JwtConfig:Key"]!)
                    ),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ClockSkew = TimeSpan.Zero,
                    RequireExpirationTime = true
                };
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Cookies["accessToken"];

                        if (!string.IsNullOrWhiteSpace(accessToken))
                        {
                            context.Token = accessToken;
                        }

                        return Task.CompletedTask;
                    }
                };
            });
            builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ContractResolver =
            new CamelCasePropertyNamesContractResolver();

        options.SerializerSettings.NullValueHandling =
            NullValueHandling.Ignore;
    });
            var app = builder.Build();
            app.UseMiddleware<ExceptionMiddleware>();
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // app.UseHttpsRedirection();
            app.UseCors("AllowAll");
            app.UseCustomExceptionHandler(builder);
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
        // Auto Register DI for Services
        private static void RegisterDIForCustomerService(WebApplicationBuilder builder)
        {
            var interfaceAssemblyShared = Assembly
                .GetAssembly(typeof(IAuthService))!
                .GetTypes()
                .Where(x => x.IsInterface && x.Name.EndsWith("Service"));

            var assemblyShared = Assembly
                .GetAssembly(typeof(AuthService))!
                .GetTypes()
                .Where(x => x.IsClass && x.Name.EndsWith("Service"));

            foreach (var @interface in interfaceAssemblyShared)
            {
                var interfaceName = @interface.Name;

                var implement = assemblyShared.FirstOrDefault(c =>
                    interfaceName.Substring(1) == c.Name);

                if (implement != null && implement.Name != "CacheService")
                {
                    builder.Services.AddScoped(@interface, implement);
                }
            }
        }
    }
}
using Homework.Domain.Models;
using Homework.Domain.Error;
using Microsoft.AspNetCore.Diagnostics;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Data.Common;
using System.Net;
using System.Text.Json.Serialization;
using System.Xml;
namespace Web.Homework.ExceptionHandler
{
    public static class ExceptionHandler
    {
        public const bool NEED_LOG_BODY_MESSAGE = true;

        public static void UseCustomExceptionHandler(this IApplicationBuilder app, WebApplicationBuilder builder)
        {
            if (NEED_LOG_BODY_MESSAGE)
            {
                app.Use(async (context, next) =>
                {
                    context.Request.EnableBuffering(); // เปิดใช้งาน Buffering เพื่อให้สามารถอ่าน Request Body เอาไว้ Log Parameter ได้
                    await next();
                });
            }

            app.UseExceptionHandler(appError =>
            {
                appError.Run(async context =>
                {

                    if (context.Features.Get<IExceptionHandlerFeature>() != null)
                    {
                        var exception = context.Features.Get<IExceptionHandlerFeature>().Error;

                        var caseGuide = Guid.NewGuid();
                        await LogginInformationAsync(caseGuide, context, exception);
                        context.Response.ContentType = "application/json";
                        var jsonSerializerSettings = new JsonSerializerSettings
                        {
                            ContractResolver = new CamelCasePropertyNamesContractResolver()
                        };
                        if (exception is CustomError customError)
                        {
                            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;

                            var errors = customError.ErrorList
                                .SelectMany(x => x.Value.Select(e => new
                                {
                                    field = x.Key,
                                    message = e.Message.Replace("- ", "")
                                }))
                                .ToList();

                            if (!errors.Any())
                            {
                                errors = customError.ErrorMessage
                                    .Select(e => new
                                    {
                                        field = "",
                                        message = e.Replace("- ", "")
                                    })
                                    .ToList();
                            }

                            await context.Response.WriteAsync(
                                JsonConvert.SerializeObject(new { errors }, jsonSerializerSettings)
                            );

                            return;
                        }
                        else
                        {
                            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                            var ex = exception.InnerException != null ? exception.InnerException : exception;
                            var msg = ex.Message;
                            var exo = exception.InnerException != null ? exception.StackTrace : string.Empty;
                            //save error log

                            string message = $"ErrorCode : {caseGuide}\n {msg}";
                            var viewModel = new CustomError(message).ToViewModel();
                            await context.Response.WriteAsync(JsonConvert.SerializeObject(viewModel, jsonSerializerSettings));
                            // add log error
                            //LoggingError(builder, context, ex, exo, message);
                        }
                    }
                });
            });
        }

        private static async Task LogginInformationAsync(Guid caseGuide, HttpContext context, Exception ex)
        {
            #region when framework error bug
            string endpoint = "";
            if (context?.Request?.Path != null)
                endpoint = context.Request.Path.Value;
            if (endpoint == "/index.html")
            {
                //don't log this error

                //The SPA default page middleware could not return the default page '/index.html' because it was not found,
                //and no other middleware handled the request.Your application is running in Production mode, so make sure it has been published,
                //or that you have built your SPA manually.Alternatively you may wish to switch to the Development environment.
                //at Microsoft.AspNetCore.SpaServices.SpaDefaultPageMiddleware.<>c__DisplayClass0_0.<Attach>b__1(HttpContext context, RequestDelegate next)
                //at Microsoft.AspNetCore.StaticFiles.StaticFileMiddleware.Invoke(HttpContext context)
                //at Microsoft.AspNetCore.Routing.EndpointMiddleware.Invoke(HttpContext httpContext)
                //at Microsoft.AspNetCore.Cors.Infrastructure.CorsMiddleware.Invoke(HttpContext context, ICorsPolicyProvider corsPolicyProvider)
                //at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
                //at Microsoft.AspNetCore.Authentication.AuthenticationMiddleware.Invoke(HttpContext context)
                //at MKT_CDXP.ExceptionHandler.ErrorHandlingMiddleware.Invoke(HttpContext context) in D:\Projects\Internal\mkt-cdxp\MKT-CDXP\MKT-CDXP\ExceptionHandler\ExceptionHandler.cs:line 132
                //at Microsoft.AspNetCore.Diagnostics.ExceptionHandlerMiddleware.<Invoke>g__Awaited|6_0(ExceptionHandlerMiddleware middleware, HttpContext context, Task task)
                return;
            }
            else if (endpoint.Contains("Authentication/Login"
                                      , StringComparison.InvariantCultureIgnoreCase))
            {
                return;
            }
            #endregion

            try
            {
                var serviceProvider = context.RequestServices;
                var request = context.Request;
                string requestPath = request.Path;
                string requestMethod = request.Method;
                string minifyJsonString = "";
                request.Body.Seek(0, SeekOrigin.Begin);
                using (var reader = new StreamReader(request.Body))
                {
                    var jsonString = await reader.ReadToEndAsync();
                    var obj = JsonConvert.DeserializeObject(jsonString);
                    minifyJsonString = JsonConvert.SerializeObject(obj, Newtonsoft.Json.Formatting.None);
                }
                var queryString = request.QueryString.HasValue ? request.QueryString.Value : "No QueryString";



                var messageNow = DateTimeOffset.UtcNow;
                //var _context = serviceProvider.GetService<loyaltyContext>();
                var _context = serviceProvider.GetService<postgresContext>();

                if (ex?.InnerException != null)
                {
                    //_context.SystemError.Add(new SystemError()
                    //{
                    //    ErrorBy = -1,
                    //    ErrorMessage = caseGuide.ToString(),
                    //    ErrorRemark = ex.InnerException.Message,
                    //    ErrorSource = $"{requestMethod} : {requestPath}",
                    //    ErrorTime = messageNow,
                    //});
                }
                //Message 1
                //_context.SystemError.Add(new SystemError()
                //{
                //    ErrorBy = -1,
                //    ErrorMessage = caseGuide.ToString(),
                //    ErrorRemark = ex.StackTrace,
                //    ErrorSource = $"{requestMethod} : {requestPath}",
                //    ErrorTime = messageNow,
                //});
                ////Message 2
                //_context.SystemError.Add(new SystemError()
                //{
                //    ErrorBy = -1,
                //    ErrorMessage = $"{caseGuide.ToString()} / {queryString}",
                //    ErrorRemark = minifyJsonString,
                //    ErrorSource = $"{requestMethod} : {requestPath}",
                //    ErrorTime = messageNow,
                //});
                _context.SaveChanges();
            }
            catch (Exception)
            { }

        }

        private static void LoggingError(WebApplicationBuilder builder, HttpContext context, Exception ex, string exo, string message)
        {
            string endpoint = "";
            if (context?.Request?.Path != null)
                endpoint = context.Request.Path.Value;

            if (endpoint == "/index.html")
            {
                //don't log this error

                //The SPA default page middleware could not return the default page '/index.html' because it was not found,
                //and no other middleware handled the request.Your application is running in Production mode, so make sure it has been published,
                //or that you have built your SPA manually.Alternatively you may wish to switch to the Development environment.
                //at Microsoft.AspNetCore.SpaServices.SpaDefaultPageMiddleware.<>c__DisplayClass0_0.<Attach>b__1(HttpContext context, RequestDelegate next)
                //at Microsoft.AspNetCore.StaticFiles.StaticFileMiddleware.Invoke(HttpContext context)
                //at Microsoft.AspNetCore.Routing.EndpointMiddleware.Invoke(HttpContext httpContext)
                //at Microsoft.AspNetCore.Cors.Infrastructure.CorsMiddleware.Invoke(HttpContext context, ICorsPolicyProvider corsPolicyProvider)
                //at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
                //at Microsoft.AspNetCore.Authentication.AuthenticationMiddleware.Invoke(HttpContext context)
                //at MKT_CDXP.ExceptionHandler.ErrorHandlingMiddleware.Invoke(HttpContext context) in D:\Projects\Internal\mkt-cdxp\MKT-CDXP\MKT-CDXP\ExceptionHandler\ExceptionHandler.cs:line 132
                //at Microsoft.AspNetCore.Diagnostics.ExceptionHandlerMiddleware.<Invoke>g__Awaited|6_0(ExceptionHandlerMiddleware middleware, HttpContext context, Task task)
                return;
            }
            var provider = builder.Services.BuildServiceProvider();
            using (var scope = provider.CreateScope())
            {
                var _context = scope.ServiceProvider.GetService<postgresContext>();

                if (endpoint is not null)
                {
                    // from API Controller //
                    //var _currentUserService = scope.ServiceProvider.GetService<ICurrentUserCoreService>();
                    //var ActionBy = _currentUserService.GetCurrentUser();
                    //SystemError sys = new SystemError()
                    //{
                    //    ErrorBy = ActionBy,
                    //    ErrorMessage = message,
                    //    ErrorRemark = ex.StackTrace + exo,
                    //    ErrorSource = endpoint,
                    //    ErrorTime = DateTimeOffset.UtcNow,
                    //};
                    //_context.SystemError.Add(sys);
                    //_context.SaveChanges();
                }
                else
                {
                    // from Background //

                }
            }
        }
    }

    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IConfiguration _configuration;

        public ErrorHandlingMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            _configuration = configuration;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (DbException ex)
            {
                var message = ex.Message;
                var inner = ex.InnerException != null ? ex.InnerException.Message : "";
                var code = StatusCodes.Status500InternalServerError;
                context.Response.StatusCode = code;
                //await CreateLogErrorFile(context.Request.Path, code, $"'{message}'", $"'{inner}'");
                await context.Response.WriteAsync("Database connection error");
            }
            catch (TimeoutException ex)
            {
                var message = ex.Message;
                var inner = ex.InnerException != null ? ex.InnerException.Message : "";
                var code = StatusCodes.Status408RequestTimeout;
                context.Response.StatusCode = code;
                //await CreateLogErrorFile(context.Request.Path, code, $"'{message}'", $"'{inner}'");
                await context.Response.WriteAsync("Timeout error");
            }
            //catch (Exception ex)
            //{
            //    var message = ex.Message;
            //    var inner = ex.InnerException != null ? ex.InnerException.Message : "";
            //    var code = StatusCodes.Status500InternalServerError;
            //    context.Response.StatusCode = code;
            //    CreateLogErrorFile(context.Request.Path, code, message, inner);
            //    await context.Response.WriteAsync($"{{ \"error\": \"{ex.Message}\" }}");
            //}
        }

        //public async Task CreateLogErrorFile(string api, int code, string message, string innerMessage)
        //{
        //    var PathServer = _configuration.GetValue<string>("PathCloud");

        //    string folderServer = Path.Combine(PathServer);

        //    string header = "Action Time,End Point, Code, Message, Inner Message";

        //    DateTimeOffset currentDate = DateTimeOffset.UtcNow;
        //    var fileName = currentDate.ToString("dd-MM-yyyy");

        //    await CreateFileCSVHelper.CreateOrUpdateFileCSVAsync(folderServer, $"{fileName}.csv", header, $"{api},{code},{message},{innerMessage}");
        //}
    }

    public static class ErrorHandlingMiddlewareExtensions
    {
        public static IApplicationBuilder UseErrorHandlingMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ErrorHandlingMiddleware>();
        }
    }
}

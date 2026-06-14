using Microsoft.AspNetCore.Http;
using System;
using System.Threading.Tasks;
namespace Web.Homework.ExceptionHandler
{
    public class SimpleErrorMiddleware
    {
        private readonly RequestDelegate _next;
        public SimpleErrorMiddleware(RequestDelegate next)
        {
            _next = next;
        }
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch(Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }
        private static Task HandleExceptionAsync(HttpContext context,Exception exception)
        {
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            context.Response.ContentType = "application/json";
            var responsePayload = new
            {
                success = false,
                message = "An unexpected error occurred.",
                details = exception.Message
            };
            string jsonString = System.Text.Json.JsonSerializer.Serialize(responsePayload);
            return context.Response.WriteAsync(jsonString);
        }
    }
}

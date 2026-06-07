using Homework.Domain.Error;
using Homework.Domain.Models;
using Homework.Domain.Interfaces.Services.UserServices;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
namespace Homework.Service.ImplementServices.Authentications.Repositories
{
    public class UserContextService : IUserContextService
    {
        private readonly postgresContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserContextService(
            postgresContext context,
            IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<string> GetCurrentRoleCodeAsync(
            long userId,
            CustomError error)
        {
            var currentRoleCode = await _context.UserRoles
                .Where(x =>
                    x.UserId == userId &&
                    x.ExpiredTime == null)
                .OrderBy(x => x.CreatedTime)
                .Select(x => x.RoleCode)
                .FirstOrDefaultAsync();

            if (string.IsNullOrWhiteSpace(currentRoleCode))
            {
                error.AddError("Role", "ไม่พบ Role ของผู้ใช้งาน");
                error.ThrowIfError();
            }

            return currentRoleCode!;
        }

        public string? GetCurrentRoleFromCookie()
        {
            var request = _httpContextAccessor.HttpContext?.Request;
            return request?.Cookies["currentRoleCode"];
        }
    }
}

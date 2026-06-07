using Homework.Domain.Error;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homework.Domain.Interfaces.Services.UserServices
{
    public interface IUserContextService
    {
        Task<string> GetCurrentRoleCodeAsync(long userId, CustomError error);
        string? GetCurrentRoleFromCookie();
    }
}

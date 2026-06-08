using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Homework.Domain.RequestModels.PermissionRequestModels;
using Homework.Domain.Error;
namespace Homework.Domain.Interfaces.Services.PermissionServices
{
    public interface IPermissionAuthorizeService
    {
        public Task<bool> AuthorizeAsync(PermissionRequestModel param, CustomError error);
    }
}

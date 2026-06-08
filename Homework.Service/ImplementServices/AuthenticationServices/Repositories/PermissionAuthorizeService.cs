using Homework.Domain.Error;
using Homework.Domain.Interfaces.RawSqlServices;
using Homework.Domain.Interfaces.Services.PermissionServices;
using Homework.Domain.Interfaces.Services.UserServices;
using Homework.Domain.RequestModels.PermissionRequestModels;

namespace Homework.Service.ImplementServices.Authentications.Repositories
{
    public class PermissionAuthorizeService : IPermissionAuthorizeService
    {
        private readonly IRawSqlService _rawSqlService;
        private readonly IUserContextService _userContextService;

        public PermissionAuthorizeService(
            IRawSqlService rawSqlService,
            IUserContextService userContextService)
        {
            _rawSqlService = rawSqlService;
            _userContextService = userContextService;
        }

        public async Task<bool> AuthorizeAsync(
            PermissionRequestModel param,
            CustomError error)
        {
            var userIdText = _userContextService.GetUserIdFromToken();

            if (string.IsNullOrWhiteSpace(userIdText))
            {
                error.AddError("User", "ไม่พบ UserId จาก Token");
            }

            var roleCode = _userContextService.GetCurrentRoleFromToken();

            if (string.IsNullOrWhiteSpace(roleCode))
            {
                error.AddError("RoleCode", "ไม่พบ RoleCode ใน Token");
            }

            if (string.IsNullOrWhiteSpace(param.PageCode))
            {
                error.AddError("PageCode", "PageCode cannot be null or empty.");
            }

            error.ThrowIfError();

            var permissionAccess =
                await _rawSqlService.QueryPermissionAccessAsync(
                    param,
                    roleCode!
                );
            
            return permissionAccess != null &&
                   permissionAccess.HasAccess;
        }
    }
}
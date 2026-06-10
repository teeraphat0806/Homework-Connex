using Homework.Domain.RequestModels.PermissionRequestModels;
using Homework.Domain.ViewModels.RawSql;

namespace Homework.Domain.Interfaces.RawSqlServices
{
    public interface IRawSqlService
    {
        Task<USP_Query_PermissionAccessViewModel?> QueryPermissionAccessAsync(
            PermissionRequestModel param,
            string roleCode);

        Task<List<USP_Query_NavbarViewModel>> QueryNavbarAsync(
            string[] roleCodes);

        Task<List<USP_Query_NavbarViewModel>> QueryPreLoginNavbarAsync();
    }
}
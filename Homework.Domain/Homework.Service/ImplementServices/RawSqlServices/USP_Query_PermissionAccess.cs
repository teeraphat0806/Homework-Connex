using Homework.Domain.Interfaces.RawSqlServices;
using Homework.Domain.Models;
using Homework.Domain.RequestModels.PermissionRequestModels;
using Homework.Domain.ViewModels.RawSql;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace Homework.Service.ImplementServices.RawSqlServices
{
    public partial class USP_Query_PermissionAccess : IRawSqlService
    {
        private readonly postgresContext _context;

        public USP_Query_PermissionAccess(postgresContext context)
        {
            _context = context;
        }

        public async Task<USP_Query_PermissionAccessViewModel?>
            QueryPermissionAccessAsync(
                PermissionRequestModel param,
                string roleCode)
        {
            var query = @"
SELECT
    TRUE AS ""HasAccess"",
    pp.""PageCode"",
    rp.""PermissionCode"",
    rp.""RoleCode""
FROM ""RolePermissions"" rp
INNER JOIN ""PermissionPages"" pp
    ON rp.""PermissionCode"" = pp.""PermissionCode""
WHERE rp.""RoleCode"" = @RoleCode
  AND pp.""PageCode"" = @PageCode
LIMIT 1;
";

            return await _context
                .Set<USP_Query_PermissionAccessViewModel>()
                .FromSqlRaw(
                    query,
                    new NpgsqlParameter("@RoleCode", roleCode),
                    new NpgsqlParameter("@PageCode", param.PageCode)
                )
                .AsNoTracking()
                .FirstOrDefaultAsync();
        }
    }
}
using Homework.Domain.ViewModels.RawSql;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using NpgsqlTypes;

namespace Homework.Service.ImplementServices.RawSqlServices
{
    public partial class RawSqlService
    {
        public async Task<List<USP_Query_NavbarViewModel>> QueryNavbarAsync(string[] roleCodes)
        {
            var query = @"
SELECT DISTINCT
    n.""NavbarName"",
    p.""PageUrl"" AS ""PageUrl"",
    n.""Seq"",
    n.""PageCode""
FROM ""RefNavbar"" n
INNER JOIN ""PermissionPages"" pp
    ON n.""PageCode"" = pp.""PageCode""
INNER JOIN ""RolePermissions"" rp
    ON pp.""PermissionCode"" = rp.""PermissionCode""
INNER JOIN ""RefPages"" p
    ON n.""PageCode"" = p.""PageCode""
WHERE rp.""RoleCode"" = ANY(@Roles)
  AND p.""IsActive"" = TRUE
ORDER BY n.""Seq"";
";

            var rolesParam = new NpgsqlParameter("@Roles", NpgsqlDbType.Array | NpgsqlDbType.Varchar)
            {
                Value = roleCodes
            };

            var res = await _context
                .Set<USP_Query_NavbarViewModel>()
                .FromSqlRaw(query, rolesParam)
                .AsNoTracking()
                .ToListAsync();

            Console.WriteLine($"Navbar count = {res.Count}");

            foreach (var item in res)
            {
                Console.WriteLine($"{item.NavbarName} | {item.PageCode} | {item.PageUrl }");
            }

            return res;
        }
    }
}
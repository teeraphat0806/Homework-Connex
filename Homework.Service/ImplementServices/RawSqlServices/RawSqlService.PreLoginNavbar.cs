using Homework.Domain.ViewModels.RawSql;
using Microsoft.EntityFrameworkCore;

namespace Homework.Service.ImplementServices.RawSqlServices
{
    public partial class RawSqlService
    {
        public async Task<List<USP_Query_NavbarViewModel>> QueryPreLoginNavbarAsync()
        {
            var query = @"
SELECT
    n.""NavbarName"",
    p.""PageUrl"" AS ""PageUrl"",
    n.""Seq"",
    n.""PageCode""
FROM ""RefNavbar"" n
INNER JOIN ""RefPages"" p
    ON n.""PageCode"" = p.""PageCode""
WHERE n.""NavbarCode"" IN ('PRE_REGISTER', 'PRE_LOGIN')
  AND p.""IsActive"" = TRUE
ORDER BY n.""Seq"";
";

            return await _context
                .Set<USP_Query_NavbarViewModel>()
                .FromSqlRaw(query)
                .AsNoTracking()
                .ToListAsync();
        }
    }
}
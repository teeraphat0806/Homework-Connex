using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homework.Domain.ViewModels.RawSql
{
    public class USP_Query_PermissionAccessViewModel
    {
        public bool HasAccess { get; set; }

        public string? PageCode { get; set; }

        public string? PermissionCode { get; set; }

        public string? RoleCode { get; set; }
    }
}

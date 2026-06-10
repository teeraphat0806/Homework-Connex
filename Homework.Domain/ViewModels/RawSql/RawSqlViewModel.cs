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
    public class USP_Query_NavbarViewModel
    {
        public string NavbarName { get; set; } = string.Empty;
        public string PageURL { get; set; } = string.Empty;
        public int? Seq { get; set; }
        public string PageCode { get; set; } = string.Empty;
    }
}

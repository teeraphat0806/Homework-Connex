using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homework.Domain.ViewModels.PermissionViewModels
{
    public class PermissionViewModels
    {
        public bool CanAccess { get; set; }

        public string? PageCode { get; set; }

        public string? PermissionCode { get; set; }

        public string? RoleCode { get; set; }

        public bool IsRoleConflict { get; set; }
    }
}

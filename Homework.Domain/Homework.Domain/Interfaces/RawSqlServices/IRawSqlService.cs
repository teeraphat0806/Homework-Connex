using Homework.Domain.RequestModels.PermissionRequestModels;
using Homework.Domain.ViewModels.RawSql;    
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace Homework.Domain.Interfaces.RawSqlServices
{
    public interface IRawSqlService
    {
        Task<USP_Query_PermissionAccessViewModel?> QueryPermissionAccessAsync(
            PermissionRequestModel PageCode,
            string roleCode);
    }
}

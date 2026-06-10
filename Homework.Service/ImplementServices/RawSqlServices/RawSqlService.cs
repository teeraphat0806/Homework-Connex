using Homework.Domain.Interfaces.RawSqlServices;
using Homework.Domain.Models;

namespace Homework.Service.ImplementServices.RawSqlServices
{
    public partial class RawSqlService : IRawSqlService
    {
        private readonly postgresContext _context;

        public RawSqlService(postgresContext context)
        {
            _context = context;
        }
    }
}
using Homework.Domain.Interfaces.Services.CategoriesServices;
using Homework.Domain.Models;
using Homework.Domain.RequestModels.CategoriesRequestModels;
using Homework.Domain.ViewModels.CategoriesViewModels;
using Homework.Domain.Error;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Homework.Service.ImplementServices.CategoriesServices
{
    public class QueryCategoriesService : IQueryCategoriesService
    {
        private readonly postgresContext _context;

        public QueryCategoriesService(postgresContext context)
        {
            _context = context;
        }

        public async Task<List<CategoriesViewModel>> GetCategoriesList(GetCategoriesRequestModel request, CustomError error)
        {
            var query = _context.RefCategories.AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.Keyword))
            {
                query = query.Where(x => x.Name.Contains(request.Keyword));
            }

            return await query
                .OrderBy(x => x.Name)
                .Select(x => new CategoriesViewModel
                {
                    CategoryId = x.CategoryId,
                    Name = x.Name
                })
                .ToListAsync();
        }
    }

    public class ManageCategoriesService : IManageCategoriesService
    {
        private readonly postgresContext _context;

        public ManageCategoriesService(postgresContext context)
        {
            _context = context;
        }
    }
}

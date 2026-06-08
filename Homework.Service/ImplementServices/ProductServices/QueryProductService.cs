using Homework.Domain.Interfaces.Services.ProductServices;
using Homework.Domain.Models;
using Homework.Domain.RequestModels.ProductRequestModels;
using Homework.Domain.ViewModels.ProductViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace Homework.Service.ImplementServices.ProductServices
{
    public class QueryProductService : IQueryProductService
    {
        private readonly postgresContext _context;

        public QueryProductService(postgresContext context)
        {
            _context = context;
        }

        public async Task<List<ProductListViewModel>> GetProductList(
            GetProductListRequestModel request)
        {
            var query = _context.Products.AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.Keyword))
            {
                query = query.Where(x =>
                    x.SKU.Contains(request.Keyword) ||
                    x.Name.Contains(request.Keyword));
            }

            if (request.CategoryId.HasValue)
            {
                query = query.Where(x => x.CategoryId == request.CategoryId.Value);
            }

            if (request.IsActive.HasValue)
            {
                query = query.Where(x => x.IsActive == request.IsActive.Value);
            }

            return await query
                .OrderByDescending(x => x.ProductId)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(x => new ProductListViewModel
                {
                    ProductId = x.ProductId,
                    SKU = x.SKU,
                    Name = x.Name,
                    Price = x.Price,
                    StockQty = x.StockQty,
                    IsActive = x.IsActive
                })
                .ToListAsync();
        }

        public async Task<ProductInfoViewModel?> GetProductInfo(
            GetProductInfoRequestModel request)
        {
            return await _context.Products
                .Where(x => x.ProductId == request.ProductId)
                .Select(x => new ProductInfoViewModel
                {
                    ProductId = x.ProductId,
                    SKU = x.SKU,
                    Name = x.Name,
                    Description = x.Description,
                    Price = x.Price,
                    Cost = x.Cost,
                    StockQty = x.StockQty,
                    CategoryId = x.CategoryId,
                    IsActive = x.IsActive
                })
                .FirstOrDefaultAsync();
        }
    }
}
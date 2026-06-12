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
using Homework.Domain.Error;
namespace Homework.Service.ImplementServices.ProductServices
{
    public class QueryProductService : IQueryProductService
    {
        private readonly postgresContext _context;
        private readonly CustomError _error;
        public QueryProductService(postgresContext context, CustomError error)
        {
            _context = context;
            _error = error;
        }

        public async Task<List<ProductListViewModel>> GetProductList(
            GetProductListRequestModel request, CustomError error)
        {
            var query = _context.Products.AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.Keyword))
            {
                query = query.Where(x =>
                    x.ProductCode.Contains(request.Keyword) ||
                    x.Name.Contains(request.Keyword));
            }

            if (request.CategoryId.HasValue)
            {
                query = query.Where(x => x.ProductCategoryMapping.Any(m => m.CategoryId == request.CategoryId.Value));
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
                    SKU = x.ProductCode,
                    Name = x.Name,
                    Price = x.ProductVariants.OrderBy(v => v.ProductVariantId).Select(v => v.Price).FirstOrDefault(),
                    StockQty = x.ProductVariants.Sum(v => v.StockQty),
                    IsActive = x.IsActive
                })
                .ToListAsync();
        }

        public async Task<ProductInfoViewModel?> GetProductInfo(
            GetProductInfoRequestModel request, CustomError error)
        {
            return await _context.Products
                .Where(x => x.ProductId == request.ProductId)
                .Select(x => new ProductInfoViewModel
                {
                    ProductId = x.ProductId,
                    SKU = x.ProductCode,
                    Name = x.Name,
                    Description = x.Description,
                    Price = x.ProductVariants.OrderBy(v => v.ProductVariantId).Select(v => v.Price).FirstOrDefault(),
                    Cost = x.ProductVariants.OrderBy(v => v.ProductVariantId).Select(v => v.Cost).FirstOrDefault(),
                    StockQty = x.ProductVariants.Sum(v => v.StockQty),
                    CategoryId = x.ProductCategoryMapping.Select(m => m.CategoryId).FirstOrDefault(),
                    IsActive = x.IsActive,
                    Variants = x.ProductVariants.Select(v => new ProductVariantViewModel
                    {
                        ProductVariantId = v.ProductVariantId,
                        VariantCode = v.VariantCode,
                        VariantName = v.VariantName,
                        Color = v.Color,
                        Price = v.Price,
                        Cost = v.Cost,
                        StockQty = v.StockQty,
                        IsActive = v.IsActive
                    }).ToList()
                })
                .FirstOrDefaultAsync();
        }
    }
}
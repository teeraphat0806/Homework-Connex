using Homework.Domain.Interfaces.Services.ProductServices;
using Homework.Domain.Models;
using Homework.Domain.RequestModels.ProductRequestModels;
using Homework.Domain.ViewModels.ProductViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
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

        public async Task<List<ProductViewModel>> GetProductList(GetProductListRequestModel param, CustomError error)
        {
            var queryDb = _context.Products.AsQueryable();

            if (!string.IsNullOrWhiteSpace(param.Keyword))
            {
                queryDb = queryDb.Where(x =>
                    EF.Functions.ILike(x.ProductCode, $"%{param.Keyword}%") ||
                    EF.Functions.ILike(x.Name, $"%{param.Keyword}%"));
            }

            if (param.CategoryIds != null && param.CategoryIds.Any())
            {
                queryDb = queryDb.Where(x => x.ProductCategoryMapping.Any(m => param.CategoryIds.Contains(m.CategoryId)));
            }
            else if (param.CategoryId.HasValue)
            {
                queryDb = queryDb.Where(x => x.ProductCategoryMapping.Any(m => m.CategoryId == param.CategoryId.Value));
            }

            if (param.IsActive.HasValue)
            {
                queryDb = queryDb.Where(x => x.IsActive == param.IsActive.Value);
            }

            var productDbList = await queryDb
                .OrderByDescending(x => x.ProductId)
                .Skip((param.PageNumber - 1) * param.PageSize)
                .Take(param.PageSize)
                .Select(x => new ProductViewModel
                {
                    ProductId = x.ProductId,
                    ProductCode = x.ProductCode,
                    Name = x.Name,
                    Description = x.Description,
                    CategoryId = x.ProductCategoryMapping.Select(m => m.CategoryId).FirstOrDefault(),
                    CategoryName = x.ProductCategoryMapping.Select(m => m.Category.Name).FirstOrDefault(),
                    CategoryIds = x.ProductCategoryMapping.Select(m => m.CategoryId).ToList(),
                    CategoryNames = x.ProductCategoryMapping.Select(m => m.Category.Name).ToList(),
                    IsActive = x.IsActive,
                    Price = x.Price,
                    StockQty = x.StockQty,
                    ImageUrl = x.ImageUrl
                })
                .ToListAsync();

            return productDbList;
        }

        public async Task<ProductViewModel?> GetProductInfo(GetProductInfoRequestModel param, CustomError error)
        {
            var productDb = await _context.Products
                .Where(x => x.ProductId == param.ProductId)
                .Select(x => new ProductViewModel
                {
                    ProductId = x.ProductId,
                    ProductCode = x.ProductCode,
                    Name = x.Name,
                    Description = x.Description,
                    CategoryId = x.ProductCategoryMapping.Select(m => m.CategoryId).FirstOrDefault(),
                    CategoryName = x.ProductCategoryMapping.Select(m => m.Category.Name).FirstOrDefault(),
                    CategoryIds = x.ProductCategoryMapping.Select(m => m.CategoryId).ToList(),
                    CategoryNames = x.ProductCategoryMapping.Select(m => m.Category.Name).ToList(),
                    IsActive = x.IsActive,
                    Price = x.Price,
                    StockQty = x.StockQty,
                    ImageUrl = x.ImageUrl
                })
                .FirstOrDefaultAsync();

            return productDb;
        }
    }
}
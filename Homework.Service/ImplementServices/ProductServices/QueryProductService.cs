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
using Homework.Domain.Enum;

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
        #region Select All product With Pagination
        public async Task<object> GetProductList(GetProductListRequestModel param, CustomError error)
        {
            var queryDb = _context.Products.AsQueryable();
            #region 1. Check Keyword Searching
            if (!string.IsNullOrWhiteSpace(param.Keyword))
            {
                queryDb = queryDb.Where(x => x.ProductCode.Contains(param.Keyword) || x.Name.Contains(param.Keyword));
            }
            #endregion
            #region 2. Check List of Categories Searching
            if (param.CategoryIds != null && param.CategoryIds.Any())
            {
                queryDb = queryDb.Where(x => x.ProductCategoryMapping.Any(m => param.CategoryIds.Contains(m.CategoryId)));
            }
            else if (param.CategoryId.HasValue)
            {
                queryDb = queryDb.Where(x => x.ProductCategoryMapping.Any(m => m.CategoryId == param.CategoryId.Value));
            }
            #endregion
            #region 3. Check iSproduct Active
            if (param.IsActive.HasValue)
            {
                queryDb = queryDb.Where(x => x.IsActive == param.IsActive.Value);
            }
            #endregion
            #region find product with pagination
            var productQuery = queryDb.Select(x => new ProductViewModel
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
                StockQty = x.ProductStockTransactions
                    .Where(t => t.Status == EnumStockTransactionStatus.Approved)
                    .Sum(t => t.TransactionType == EnumStockTransactionType.Return ? t.Qty :
                             t.TransactionType == EnumStockTransactionType.Issue ? -t.Qty :
                             t.TransactionType == EnumStockTransactionType.Adjust ? t.Qty : 0),
                ImageUrl = x.ImageUrl
            });

            if (param.OnlyWithStock == true)
            {
                productQuery = productQuery.Where(x => x.StockQty > 0);
            }

            var loadOptions = param.LoadOptions ?? new DevExtreme.AspNet.Data.DataSourceLoadOptionsBase();
            var result = await DevExtreme.AspNet.Data.DataSourceLoader.LoadAsync(productQuery, loadOptions);
            return result;
        }
            #endregion
        #endregion
        #region GetProductInfo By productId
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
                    StockQty = x.ProductStockTransactions
                        .Where(t => t.Status == EnumStockTransactionStatus.Approved)
                        .Sum(t => t.TransactionType == EnumStockTransactionType.Return ? t.Qty :
                                 t.TransactionType == EnumStockTransactionType.Issue ? -t.Qty :
                                 t.TransactionType == EnumStockTransactionType.Adjust ? t.Qty : 0),
                    ImageUrl = x.ImageUrl
                })
                .FirstOrDefaultAsync();

            return productDb;
        }
        #endregion
    }
}
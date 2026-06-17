using Homework.Domain.Enum;
using Homework.Domain.Error;
using Homework.Domain.Interfaces.Services.ProductServices;
using Homework.Domain.Interfaces.Services.UserServices;
using Homework.Domain.Models;
using Homework.Domain.RequestModels.OrderRequestModels;
using Homework.Domain.RequestModels.ProductRequestModels;
using Homework.Domain.ValidateModels.ProductValidateModels;
using Homework.Domain.ViewModels.OrderViewModels;
using Homework.Domain.ViewModels.ProductViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Homework.Service.ImplementServices.ProductServices
{
    public class ManageProductService : IManageProductService
    {
        private readonly postgresContext _context;
        private readonly IUserContextService _userContextService;
        private readonly CustomError _error;

        public ManageProductService(postgresContext context, IUserContextService userContextService, CustomError error)
        {
            _context = context;
            _userContextService = userContextService;
            _error = error;
        }

        #region Create Product

        public async Task<ProductManageViewModel> CreateProduct(CreateProductRequestModel param, CustomError error)
        {
            #region 1. Validation
            CreateProductValidateModel.Validate(param, error);
            error.ThrowIfError();
            #endregion

            var timeStamp = DateTime.UtcNow;

            #region 2. Get User ID
            long? userId = null;
            var userIdText = _userContextService.GetUserIdFromToken();
            if (long.TryParse(userIdText, out long parsedUserId))
            {
                userId = parsedUserId;
            }
            #endregion

            using var transactionDb = await _context.Database.BeginTransactionAsync();
            try
            {
                #region 3. DB Check ProductCode Unique
                var isProductCodeExists = await _context.Products.AnyAsync(x => x.ProductCode == param.ProductCode);
                if (isProductCodeExists)
                {
                    error.AddError("ProductCode", "ProductCode นี้มีในระบบแล้ว");
                }
                error.ThrowIfError();
                #endregion

                #region 4. DB Check Category ID exists
                var categoryIdList = new List<long>();
                if (param.CategoryIds != null && param.CategoryIds.Any())
                {
                    categoryIdList.AddRange(param.CategoryIds);
                }
                if (param.CategoryId.HasValue)
                {
                    categoryIdList.Add(param.CategoryId.Value);
                }
                categoryIdList = categoryIdList.Distinct().ToList();

                var categoryDbList = await _context.RefCategories
                    .Where(c => categoryIdList.Contains(c.CategoryId))
                    .ToListAsync();

                var categoryMap = categoryDbList.ToDictionary(c => c.CategoryId);

                foreach (var catId in categoryIdList)
                {
                    if (!categoryMap.ContainsKey(catId))
                    {
                        error.AddError("CategoryId", $"ไม่พบหมวดหมู่สินค้ารหัส {catId} ในระบบ");
                    }
                }
                error.ThrowIfError();
                #endregion

                #region 5. Create Product Entity
                var productDb = new Products
                {
                    ProductCode = param.ProductCode,
                    Name = param.Name,
                    Description = param.Description,
                    Price = param.Price,
                    StockQty = param.StockQty,
                    ImageUrl = param.ImageUrl,
                    IsActive = true,
                    CreatedByUserId = userId,
                    CreatedTime = timeStamp,
                    ModifiedTime = timeStamp
                };

                _context.Products.Add(productDb);
                await _context.SaveChangesAsync();
                #endregion

                #region 6. Add Category Mapping
                foreach (var catId in categoryIdList)
                {
                    _context.ProductCategoryMapping.Add(new ProductCategoryMapping
                    {
                        ProductId = productDb.ProductId,
                        CategoryId = catId
                    });
                }
                await _context.SaveChangesAsync();
                #endregion

                #region 7. Create LogProduct
                var logProductDb = new LogProducts
                {
                    ProductId = productDb.ProductId,
                    ProductCode = productDb.ProductCode,
                    Name = productDb.Name,
                    Description = productDb.Description,
                    Price = productDb.Price,
                    Cost = 0,
                    StockQty = productDb.StockQty,
                    CategoryId = categoryIdList.FirstOrDefault(),
                    IsActive = productDb.IsActive,
                    CreatedByUserId = userId,
                    Action = "CREATE",
                    LogTime = timeStamp
                };
                _context.LogProducts.Add(logProductDb);
                await _context.SaveChangesAsync();
                #endregion

                await transactionDb.CommitAsync();

                return new ProductManageViewModel
                {
                    IsSuccess = true,
                    Message = "สร้างสินค้าเรียบร้อยแล้ว",
                    ProductId = productDb.ProductId
                };
            }
            catch (Exception)
            {
                await transactionDb.RollbackAsync();
                throw;
            }
        }

        #endregion

        #region Update Product

        public async Task<ProductManageViewModel> UpdateProduct(UpdateProductRequestModel param, CustomError error)
        {
            #region 1. Validation
            UpdateProductValidateModel.Validate(param, error);
            error.ThrowIfError();
            #endregion

            var timeStamp = DateTime.UtcNow;

            #region 2. Get User ID
            long? userId = null;
            var userIdText = _userContextService.GetUserIdFromToken();
            if (long.TryParse(userIdText, out long parsedUserId))
            {
                userId = parsedUserId;
            }
            #endregion

            using var transactionDb = await _context.Database.BeginTransactionAsync();
            try
            {
                #region 3. Query productDb
                var productDb = await _context.Products
                    .Include(x => x.ProductCategoryMapping)
                    .FirstOrDefaultAsync(x => x.ProductId == param.ProductId);

                if (productDb == null)
                {
                    error.AddError("Product", "ไม่พบสินค้า");
                    error.ThrowIfError();
                }
                #endregion

                #region 4. DB Check ProductCode Unique
                if (productDb.ProductCode != param.ProductCode)
                {
                    var isProductCodeExists = await _context.Products.AnyAsync(x => x.ProductCode == param.ProductCode && x.ProductId != param.ProductId);
                    if (isProductCodeExists)
                    {
                        error.AddError("ProductCode", "ProductCode นี้มีในระบบแล้ว");
                    }
                }
                error.ThrowIfError();
                #endregion

                #region 5. DB Check Category ID exists
                var categoryIdList = new List<long>();
                if (param.CategoryIds != null && param.CategoryIds.Any())
                {
                    categoryIdList.AddRange(param.CategoryIds);
                }
                if (param.CategoryId.HasValue)
                {
                    categoryIdList.Add(param.CategoryId.Value);
                }
                categoryIdList = categoryIdList.Distinct().ToList();

                var categoryDbList = await _context.RefCategories
                    .Where(c => categoryIdList.Contains(c.CategoryId))
                    .ToListAsync();

                var categoryMap = categoryDbList.ToDictionary(c => c.CategoryId);

                foreach (var catId in categoryIdList)
                {
                    if (!categoryMap.ContainsKey(catId))
                    {
                        error.AddError("CategoryId", $"ไม่พบหมวดหมู่สินค้ารหัส {catId} ในระบบ");
                    }
                }
                error.ThrowIfError();
                #endregion

                #region 6. Update Product Properties
                productDb.ProductCode = param.ProductCode;
                productDb.Name = param.Name;
                productDb.Description = param.Description;
                productDb.Price = param.Price;
                productDb.StockQty = param.StockQty;
                productDb.ImageUrl = param.ImageUrl;
                productDb.IsActive = param.IsActive;
                productDb.ModifiedByUserId = userId;
                productDb.ModifiedTime = timeStamp;
                #endregion

                #region 7. Update Category Mapping
                _context.ProductCategoryMapping.RemoveRange(productDb.ProductCategoryMapping);
                foreach (var catId in categoryIdList)
                {
                    _context.ProductCategoryMapping.Add(new ProductCategoryMapping
                    {
                        ProductId = productDb.ProductId,
                        CategoryId = catId
                    });
                }
                await _context.SaveChangesAsync();
                #endregion

                #region 8. Create LogProduct
                var logProductDb = new LogProducts
                {
                    ProductId = productDb.ProductId,
                    ProductCode = productDb.ProductCode,
                    Name = productDb.Name,
                    Description = productDb.Description,
                    Price = productDb.Price,
                    Cost = 0,
                    StockQty = productDb.StockQty,
                    CategoryId = categoryIdList.FirstOrDefault(),
                    IsActive = productDb.IsActive,
                    CreatedByUserId = userId,
                    Action = "UPDATE",
                    LogTime = timeStamp
                };
                _context.LogProducts.Add(logProductDb);
                await _context.SaveChangesAsync();
                #endregion

                await transactionDb.CommitAsync();

                return new ProductManageViewModel
                {
                    IsSuccess = true,
                    Message = "อัปเดตสินค้าเรียบร้อยแล้ว",
                    ProductId = productDb.ProductId
                };
            }
            catch (Exception)
            {
                await transactionDb.RollbackAsync();
                throw;
            }
        }

        #endregion

        #region Delete Product

        public async Task<ProductManageViewModel> DeleteProduct(DeleteProductRequestModel param, CustomError error)
        {
            var timeStamp = DateTime.UtcNow;

            #region 1. Get User ID
            long? userId = null;
            var userIdText = _userContextService.GetUserIdFromToken();
            if (long.TryParse(userIdText, out long parsedUserId))
            {
                userId = parsedUserId;
            }
            #endregion

            using var transactionDb = await _context.Database.BeginTransactionAsync();
            try
            {
                #region 2. Query productDb
                var productDb = await _context.Products
                    .Include(x => x.ProductCategoryMapping)
                    .FirstOrDefaultAsync(x => x.ProductId == param.ProductId);

                if (productDb == null)
                {
                    error.AddError("Product", "ไม่พบสินค้า");
                    error.ThrowIfError();
                }
                #endregion

                #region 3. Check OrderItems
                var hasOrders = await _context.OrderItems.AnyAsync(oi => oi.ProductId == param.ProductId);
                #endregion

                string message;
                string actionName;

                #region 4. Soft Delete or Hard Delete
                if (hasOrders)
                {
                    // Soft-delete: mark product as inactive
                    productDb.IsActive = false;
                    productDb.ModifiedByUserId = userId;
                    productDb.ModifiedTime = timeStamp;
                    actionName = "SOFT_DELETE";
                    message = "ปิดใช้งานสินค้าเรียบร้อยแล้ว";
                }
                else
                {
                    // Hard-delete: Remove category mappings and product
                    _context.ProductCategoryMapping.RemoveRange(productDb.ProductCategoryMapping);
                    _context.Products.Remove(productDb);
                    actionName = "DELETE";
                    message = "ลบสินค้าเรียบร้อยแล้ว";
                }
                await _context.SaveChangesAsync();
                #endregion

                #region 5. Create LogProduct
                var logProductDb = new LogProducts
                {
                    ProductId = productDb.ProductId,
                    ProductCode = productDb.ProductCode,
                    Name = productDb.Name,
                    Description = productDb.Description,
                    Price = productDb.Price,
                    Cost = 0,
                    StockQty = productDb.StockQty,
                    CategoryId = productDb.ProductCategoryMapping.Select(m => m.CategoryId).FirstOrDefault(),
                    IsActive = productDb.IsActive,
                    CreatedByUserId = userId,
                    Action = actionName,
                    LogTime = timeStamp
                };
                _context.LogProducts.Add(logProductDb);
                await _context.SaveChangesAsync();
                #endregion

                await transactionDb.CommitAsync();

                return new ProductManageViewModel
                {
                    IsSuccess = true,
                    Message = message,
                    ProductId = productDb.ProductId
                };
            }
            catch (Exception)
            {
                await transactionDb.RollbackAsync();
                throw;
            }
        }

        #endregion

        
    }
}

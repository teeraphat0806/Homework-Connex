using Homework.Domain.Interfaces.Services.ProductServices;
using Homework.Domain.Interfaces.Services.UserServices;
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
    public class ManageProductService : IManageProductService
    {
        private readonly postgresContext _context;
        private readonly IUserContextService _userContextService;
        private readonly CustomError _error;
        public ManageProductService(postgresContext context, IUserContextService userContextService ,CustomError error)
        {
            _context = context;
            _userContextService = userContextService;
            _error = error;
        }

        public async Task<ProductManageViewModel> CreateProduct(
            CreateProductRequestModel request, CustomError error)
        {
            await ValidateProduct(request, error);

            // 3. Get User ID
            long? userId = null;
            var userIdText = _userContextService.GetUserIdFromToken();
            if (long.TryParse(userIdText, out long parsedUserId))
            {
                userId = parsedUserId;
            }

            // 4. Create Product Entity
            var newProduct = new Products
            {
                ProductCode = request.ProductCode,
                Name = request.Name,
                Description = request.Description,
                IsActive = true,
                CreatedByUserId = userId,
                CreatedTime = DateTime.UtcNow,
                ModifiedTime = DateTime.UtcNow
            };

            _context.Products.Add(newProduct);
            await _context.SaveChangesAsync(); // save to generate ProductId

            // 5. Add Category Mapping
            var categoryMapping = new ProductCategoryMapping
            {
                ProductId = newProduct.ProductId,
                CategoryId = request.CategoryId.Value
            };
            _context.ProductCategoryMapping.Add(categoryMapping);

            // 6. Handle Variants
            if (request.Variants != null && request.Variants.Any())
            {
                var variantCodes = new HashSet<string>();
                for (int i = 0; i < request.Variants.Count; i++)
                {
                    var v = request.Variants[i];
                    bool flowControl = await ValidateVariantProduct(error, variantCodes, i, v);
                    if (!flowControl)
                    {
                        continue;
                    }

                    var newVariant = new ProductVariants
                    {
                        ProductId = newProduct.ProductId,
                        VariantCode = v.VariantCode,
                        VariantName = string.IsNullOrWhiteSpace(v.VariantName) ? request.Name : v.VariantName,
                        Color = v.Color,
                        Price = v.Price,
                        StockQty = v.StockQty,
                        IsActive = true,
                        CreatedTime = DateTime.UtcNow
                    };
                    _context.ProductVariants.Add(newVariant);
                }
            }
            else
            {
                // Create a default variant if none provided
                var isVariantCodeExists = await _context.ProductVariants.AnyAsync(x => x.VariantCode == request.ProductCode);
                if (isVariantCodeExists)
                {
                    error.AddError("ProductCode", "รหัส Variant สำหรับ ProductCode นี้มีในระบบแล้ว");
                }
                error.ThrowIfError();

                var defaultVariant = new ProductVariants
                {
                    ProductId = newProduct.ProductId,
                    VariantCode = request.ProductCode,
                    VariantName = request.Name,
                    Color = string.Empty,
                    Price = request.Price,
                    StockQty = request.StockQty,
                    IsActive = true,
                    CreatedTime = DateTime.UtcNow
                };
                _context.ProductVariants.Add(defaultVariant);
            }

            error.ThrowIfError();
            await _context.SaveChangesAsync();

            return new ProductManageViewModel
            {
                IsSuccess = true,
                Message = "สร้างสินค้าเรียบร้อยแล้ว",
                ProductId = newProduct.ProductId
            };
        }

        private async Task<bool> ValidateVariantProduct(CustomError error, HashSet<string> variantCodes, int i, ProductVariantRequestModel v)
        {
            if (string.IsNullOrWhiteSpace(v.VariantCode))
            {
                error.AddError($"Variants[{i}].VariantCode", $"กรุณากรอกรหัส Variant ที่ {i + 1}");
                return false;
            }
            if (variantCodes.Contains(v.VariantCode))
            {
                error.AddError($"Variants[{i}].VariantCode", $"รหัส Variant '{v.VariantCode}' ซ้ำในรายการ");
                return false;
            }
            variantCodes.Add(v.VariantCode);

            var isVariantCodeExists = await _context.ProductVariants.AnyAsync(x => x.VariantCode == v.VariantCode);
            if (isVariantCodeExists)
            {
                error.AddError($"Variants[{i}].VariantCode", $"รหัส Variant '{v.VariantCode}' นี้มีในระบบแล้ว");
                return false;
            }

            return true;
        }

        private async Task ValidateProduct(CreateProductRequestModel request, CustomError error)
        {
            // 1. Validate Category selection
            if (!request.CategoryId.HasValue || request.CategoryId.Value <= 0)
            {
                error.AddError("CategoryId", "กรุณาเลือกหมวดหมู่สินค้า");
            }
            error.ThrowIfError();

            // 2. Validate ProductCode (ProductCode) and Name
            if (string.IsNullOrWhiteSpace(request.ProductCode))
            {
                error.AddError("ProductCode", "กรุณากรอก ProductCode");
            }
            else
            {
                var isProductCodeExists = await _context.Products.AnyAsync(x => x.ProductCode == request.ProductCode);
                if (isProductCodeExists)
                {
                    error.AddError("ProductCode", "ProductCode นี้มีในระบบแล้ว");
                }
            }

            if (string.IsNullOrWhiteSpace(request.Name))
            {
                error.AddError("Name", "กรุณากรอกชื่อสินค้า");
            }
            error.ThrowIfError();
        }

        public async Task<ProductManageViewModel> UpdateProduct(
            UpdateProductRequestModel request, CustomError error)
        {
            // 1. Find the product
            var product = await _context.Products
                .Include(x => x.ProductCategoryMapping)
                .Include(x => x.ProductVariants)
                .FirstOrDefaultAsync(x => x.ProductId == request.ProductId);

            if (product == null)
            {
                error.AddError("Product", "ไม่พบสินค้า");
                error.ThrowIfError();
            }

            // 2. Validate Category selection
            if (!request.CategoryId.HasValue || request.CategoryId.Value <= 0)
            {
                error.AddError("CategoryId", "กรุณาเลือกหมวดหมู่สินค้า");
            }
            error.ThrowIfError();

            // 3. Validate ProductCode uniqueness (if modified)
            if (string.IsNullOrWhiteSpace(request.ProductCode))
            {
                error.AddError("ProductCode", "กรุณากรอก ProductCode");
            }
            else if (product.ProductCode != request.ProductCode)
            {
                var isProductCodeExists = await _context.Products.AnyAsync(x => x.ProductCode == request.ProductCode && x.ProductId != request.ProductId);
                if (isProductCodeExists)
                {
                    error.AddError("ProductCode", "ProductCode นี้มีในระบบแล้ว");
                }
            }

            if (string.IsNullOrWhiteSpace(request.Name))
            {
                error.AddError("Name", "กรุณากรอกชื่อสินค้า");
            }
            error.ThrowIfError();

            // 4. Update product properties
            long? userId = null;
            var userIdText = _userContextService.GetUserIdFromToken();
            if (long.TryParse(userIdText, out long parsedUserId))
            {
                userId = parsedUserId;
            }

            product.ProductCode = request.ProductCode;
            product.Name = request.Name;
            product.Description = request.Description;
            product.IsActive = request.IsActive;
            product.ModifiedByUserId = userId;
            product.ModifiedTime = DateTime.UtcNow;

            // 5. Update category mapping
            // Remove existing mappings first
            _context.ProductCategoryMapping.RemoveRange(product.ProductCategoryMapping);
            // Add new mapping
            var categoryMapping = new ProductCategoryMapping
            {
                ProductId = product.ProductId,
                CategoryId = request.CategoryId.Value
            };
            _context.ProductCategoryMapping.Add(categoryMapping);

            // 6. Update variants
            if (request.Variants != null && request.Variants.Any())
            {
                // Remove existing variants that are NOT in the request
                var incomingCodes = request.Variants.Select(v => v.VariantCode).ToHashSet();
                var variantsToRemove = product.ProductVariants.Where(pv => !incomingCodes.Contains(pv.VariantCode)).ToList();
                _context.ProductVariants.RemoveRange(variantsToRemove);

                var variantCodes = new HashSet<string>();
                for (int i = 0; i < request.Variants.Count; i++)
                {
                    var v = request.Variants[i];
                    if (string.IsNullOrWhiteSpace(v.VariantCode))
                    {
                        error.AddError($"Variants[{i}].VariantCode", $"กรุณากรอกรหัส Variant ที่ {i + 1}");
                        continue;
                    }
                    if (variantCodes.Contains(v.VariantCode))
                    {
                        error.AddError($"Variants[{i}].VariantCode", $"รหัส Variant '{v.VariantCode}' ซ้ำในรายการ");
                        continue;
                    }
                    variantCodes.Add(v.VariantCode);

                    // Check DB uniqueness (excluding current product's variants)
                    var isVariantCodeExists = await _context.ProductVariants.AnyAsync(x => x.VariantCode == v.VariantCode && x.ProductId != product.ProductId);
                    if (isVariantCodeExists)
                    {
                        error.AddError($"Variants[{i}].VariantCode", $"รหัส Variant '{v.VariantCode}' นี้มีในระบบแล้ว");
                        continue;
                    }

                    // Check if variant already exists on this product
                    var existingVariant = product.ProductVariants.FirstOrDefault(x => x.VariantCode == v.VariantCode);
                    if (existingVariant != null)
                    {
                        // Update existing variant details
                        existingVariant.VariantName = string.IsNullOrWhiteSpace(v.VariantName) ? request.Name : v.VariantName;
                        existingVariant.Color = v.Color;
                        existingVariant.Price = v.Price;
                        existingVariant.StockQty = v.StockQty;
                        existingVariant.IsActive = request.IsActive;
                    }
                    else
                    {
                        // Add new variant
                        var newVariant = new ProductVariants
                        {
                            ProductId = product.ProductId,
                            VariantCode = v.VariantCode,
                            VariantName = string.IsNullOrWhiteSpace(v.VariantName) ? request.Name : v.VariantName,
                            Color = v.Color,
                            Price = v.Price,
                            StockQty = v.StockQty,
                            IsActive = true,
                            CreatedTime = DateTime.UtcNow
                        };
                        _context.ProductVariants.Add(newVariant);
                    }
                }
            }
            else
            {
                // If no variants list is provided, update or create default variant based on the root properties
                var existingVariant = product.ProductVariants.FirstOrDefault(x => x.VariantCode == request.ProductCode)
                                      ?? product.ProductVariants.FirstOrDefault();

                if (existingVariant != null)
                {
                    existingVariant.VariantCode = request.ProductCode;
                    existingVariant.VariantName = request.Name;
                    existingVariant.Price = request.Price;
                    existingVariant.StockQty = request.StockQty;
                    existingVariant.IsActive = request.IsActive;
                }
                else
                {
                    // Create default variant if it doesn't exist at all
                    var defaultVariant = new ProductVariants
                    {
                        ProductId = product.ProductId,
                        VariantCode = request.ProductCode,
                        VariantName = request.Name,
                        Color = string.Empty,
                        Price = request.Price,
                        StockQty = request.StockQty,
                        IsActive = true,
                        CreatedTime = DateTime.UtcNow
                    };
                    _context.ProductVariants.Add(defaultVariant);
                }
            }

            error.ThrowIfError();
            await _context.SaveChangesAsync();

            return new ProductManageViewModel
            {
                IsSuccess = true,
                Message = "อัปเดตสินค้าเรียบร้อยแล้ว",
                ProductId = product.ProductId
            };
        }

        public async Task<ProductManageViewModel> DeleteProduct(
            DeleteProductRequestModel request, CustomError error)
        {
            var product = await _context.Products
                .Include(x => x.ProductCategoryMapping)
                .Include(x => x.ProductVariants)
                .FirstOrDefaultAsync(x => x.ProductId == request.ProductId);

            if (product == null)
            {
                error.AddError("Product", "ไม่พบสินค้า");
                error.ThrowIfError();
            }

            long? userId = null;
            var userIdText = _userContextService.GetUserIdFromToken();
            if (long.TryParse(userIdText, out long parsedUserId))
            {
                userId = parsedUserId;
            }
            var hasOrders = await _context.OrderItems.AnyAsync(
                oi => product.ProductVariants
                    .Select(v => v.ProductVariantId)
                    .Contains(oi.ProductVariantId)
            );
            string message;
            if (hasOrders)
            {
                // Soft-delete: mark product and its variants as inactive
                product.IsActive = false;
                product.ModifiedByUserId = userId;
                product.ModifiedTime = DateTime.UtcNow;

                foreach (var variant in product.ProductVariants)
                {
                    variant.IsActive = false;
                }

                message = "ปิดใช้งานสินค้าเรียบร้อยแล้ว";
            }
            else
            {
                // Remove variants, category mapping, and the product itself
                _context.ProductVariants.RemoveRange(product.ProductVariants);
                _context.ProductCategoryMapping.RemoveRange(product.ProductCategoryMapping);
                _context.Products.Remove(product);
                message = "ลบสินค้าเรียบร้อยแล้ว";
            }

            await _context.SaveChangesAsync();

            return new ProductManageViewModel
            {
                IsSuccess = true,
                Message = message,
                ProductId = product.ProductId
            };
        }
        public async Task<ProductManageViewModel> DeleteProductVariant(DeleteProductVariantRequestModel request,CustomError error)
        {
            var variant = await _context.ProductVariants
                .Include(x => x.Product)
                .FirstOrDefaultAsync(x =>
                    x.ProductVariantId == request.ProductVariantId);

            if (variant == null)
            {
                error.AddError("ProductVariant", "ไม่พบ Variant");
                error.ThrowIfError();
            }

            long? userId = null;
            var userIdText = _userContextService.GetUserIdFromToken();

            if (long.TryParse(userIdText, out long parsedUserId))
            {
                userId = parsedUserId;
            }

            var hasOrders = await _context.OrderItems
                .AnyAsync(oi => oi.ProductVariantId == request.ProductVariantId);

            string message;

            if (hasOrders)
            {
                variant.IsActive = false;
                message = "ปิดใช้งาน Variant เรียบร้อยแล้ว";
            }
            else
            {
                _context.ProductVariants.Remove(variant);
                message = "ลบ Variant เรียบร้อยแล้ว";
            }

            if (variant.Product != null)
            {
                variant.Product.ModifiedByUserId = userId;
                variant.Product.ModifiedTime = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            return new ProductManageViewModel
            {
                IsSuccess = true,
                Message = message,
                ProductId = variant.ProductId
            };
        }
    }
}

using Homework.Domain.Interfaces.Services.OrderServices;
using Homework.Domain.Interfaces.Services.UserServices;
using Homework.Domain.Models;
using Homework.Domain.RequestModels.OrderRequestModels;
using Homework.Domain.ViewModels.OrderViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Homework.Domain.Error;
namespace Homework.Service.ImplementServices.OrderServices
{
    public class ManageOrderService : IManageOrderService
    {
        private readonly postgresContext _context;
        private readonly IUserContextService _userContextService;
        private readonly CustomError _error;
        public ManageOrderService(postgresContext context, IUserContextService userContextService, CustomError error)
        {
            _context = context; 
            _userContextService = userContextService;
            _error = error;
        }

        public async Task<OrderManageViewModel> CreateOrder(CreateOrderRequestModel request, CustomError error)
        {
            // 1. Generate OrderNo
            var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var random = new Random().Next(1000, 9999);
            var orderNo = $"ORD-{timestamp}-{random}";

            // Get current userId
            long? userId = null;
            var userIdText = _userContextService.GetUserIdFromToken();
            if (long.TryParse(userIdText, out long parsedUserId))
            {
                userId = parsedUserId;
            }

            // 2. Validate products and calculate amounts
            decimal totalAmount = 0;
            var orderItems = new List<OrderItems>();

            if (request.OrderItems == null || !request.OrderItems.Any())
            {
                error.AddError("Order", "ออเดอร์ต้องมีอย่างน้อย 1 ตัว");
            }
            error.ThrowIfError();

            foreach (var item in request.OrderItems)
            {
                var product = await _context.Products
                    .Include(p => p.ProductVariants)
                    .FirstOrDefaultAsync(p => p.ProductId == item.ProductId);

                if (product == null)
                {
                    error.AddError("Product", "ไม่พบสินค้า");
                    error.ThrowIfError();
                }

                var variant = product.ProductVariants.OrderBy(v => v.ProductVariantId).FirstOrDefault();
                if (variant == null || variant.StockQty < item.Qty)
                {
                    error.AddError("Product", "สินค้าหมดคลัง");
                    error.ThrowIfError();
                }

                var unitPrice = variant.Price;
                var discount = item.Discount;
                var netAmount = (unitPrice * item.Qty) - discount;

                totalAmount += netAmount;

                orderItems.Add(new OrderItems
                {
                    ProductVariantId = variant.ProductVariantId,
                    Qty = item.Qty,
                    UnitPrice = unitPrice,
                    Discount = discount,
                    NetAmount = netAmount,
                    OrderItemStatus = "Pending",
                    OrderItemStatusCode = "PENDING"
                });

                // Deduct stock from the first/default variant
                variant.StockQty -= item.Qty;
            }

            var vatAmount = Math.Round(totalAmount * 0.07m, 2);

            var order = new Orders
            {
                OrderNo = orderNo,
                OrderDate = DateTime.UtcNow,
                TotalAmount = totalAmount,
                VatAmount = vatAmount,
                Status = "Pending",
                CreatedByUserId = userId,
                CreatedTime = DateTime.UtcNow,
                ModifiedTime = DateTime.UtcNow,
                OrderItems = orderItems
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return new OrderManageViewModel
            {
                IsSuccess = true,
                Message = "Order created successfully",
                OrderId = order.OrderId
            };
        }

        public async Task<OrderManageViewModel> UpdateOrder(UpdateOrderRequestModel request, CustomError error)
        {
            var order = await _context.Orders.FindAsync(request.OrderId);
            if (order == null)
            {
                error.AddError("Order", "ไม่พบออเดอร์");
            }
            error.ThrowIfError();
            long? userId = null;
            var userIdText = _userContextService.GetUserIdFromToken();
            if (long.TryParse(userIdText, out long parsedUserId))
            {
                userId = parsedUserId;
            }

            order.Status = request.Status;
            order.ModifiedByUserId = userId;
            order.ModifiedTime = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new OrderManageViewModel
            {
                IsSuccess = true,
                Message = "อัปเดตออเดอร์เรียบร้อยแล้ว",
                OrderId = order.OrderId
            };
        }

        public async Task<OrderManageViewModel> DeleteOrder(DeleteOrderRequestModel request, CustomError error)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.ProductVariant)
                .FirstOrDefaultAsync(o => o.OrderId == request.OrderId);

            if (order == null)
            {
                error.AddError("Order", "ไม่พบออเดอร์");
            }
            error.ThrowIfError();
            // Return stock back to product variants
            foreach (var item in order.OrderItems)
            {
                if (item.ProductVariant != null)
                {
                    item.ProductVariant.StockQty += item.Qty;
                }
            }

            _context.OrderItems.RemoveRange(order.OrderItems);
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return new OrderManageViewModel
            {
                IsSuccess = true,
                Message = "ลบออเดอร์เรียบร้อยแล้ว",
                OrderId = request.OrderId
            };
        }
    }
}

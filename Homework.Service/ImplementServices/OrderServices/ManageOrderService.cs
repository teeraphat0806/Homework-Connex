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
using Homework.Domain.Enum;
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
        public async Task<OrderManageViewModel> CreateOrder(CreateOrderRequestModel param, CustomError error)
        {
            Homework.Domain.ValidateModels.OrderValidateModels.CreateOrderValidateModel.Validate(param, error);
            error.ThrowIfError();

            // 1. Generate OrderNo
            var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            string orderNo = GenerateOrderNo(timestamp);

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

            foreach (var item in param.OrderItems)
            {
                var product = await _context.Products
                    .FirstOrDefaultAsync(p => p.ProductId == item.ProductId);

                if (product == null)
                {
                    error.AddError("Product", $"ไม่พบสินค้ารหัส {item.ProductId}");
                    error.ThrowIfError();
                }

                if (product.StockQty < item.Qty)
                {
                    error.AddError("Product", $"สินค้า '{product.Name}' หมดคลัง หรือมีจำนวนไม่พอ");
                    error.ThrowIfError();
                }

                var unitPrice = product.Price;
                var netAmount = (unitPrice * item.Qty);

                totalAmount += netAmount;

                orderItems.Add(new OrderItems
                {
                    ProductId = product.ProductId,
                    Qty = item.Qty,
                    Price = unitPrice,
                    OrderItemStatus = "Pending",
                    OrderItemStatusCode = "PENDING"
                });

                // Deduct stock from product directly
                product.StockQty -= item.Qty;
            }

            var vatAmount = Math.Round(totalAmount * 0.07m, 2);

            var order = new Orders
            {
                OrderNo = orderNo,
                OrderDate = DateTime.UtcNow,
                TotalAmount = totalAmount,
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

        private static string GenerateOrderNo(string timestamp)
        {
            var random = new Random().Next(1000, 9999);
            var orderNo = $"ORD-{timestamp}-{random}";
            return orderNo;
        }

        public async Task<OrderManageViewModel> UpdateOrder(UpdateOrderRequestModel param, CustomError error)
        {
            ValidateUpdateOrder(param, error);
            error.ThrowIfError();

            var order = await _context.Orders.Include(x => x.OrderItems).FirstOrDefaultAsync(x => x.OrderId == param.OrderId);
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

            order.OrderDate = param.OrderDate ?? order.OrderDate;
            order.Status = param.Status ?? order.Status;

            var requestItemIds = param.OrderItems.Where(x=>x.OrderItemId.HasValue).Select(x => x.OrderItemId!.Value).ToList();
            var deleteItems = order.OrderItems.Where(x=>!requestItemIds.Contains(x.OrderItemId)).ToList();

            _context.OrderItems.RemoveRange(deleteItems);

            foreach(var Item in param.OrderItems)
            {
                if (Item.OrderItemId.HasValue)
                {
                    var existingItem = order.OrderItems.FirstOrDefault(x => x.OrderItemId == Item.OrderItemId.Value);
                    if (existingItem != null)
                    {
                        existingItem.ProductId = Item.ProductId;
                        existingItem.Qty = Item.Qty;
                        existingItem.Price = Item.Price;
                        existingItem.OrderItemStatus = Item.OrderItemStatus;
                    }
                }
                else
                {
                    order.OrderItems.Add(new OrderItems
                    {
                        ProductId = Item.ProductId,
                        Qty = Item.Qty,
                        Price = Item.Price,
                        OrderItemStatus = Item.OrderItemStatus
                    });
                }
            }

            order.TotalAmount = order.OrderItems.Where(x => !_context.Entry(x).State.Equals(EntityState.Deleted)).Sum(x => x.Qty * x.Price);

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

        private static void ValidateUpdateOrder(UpdateOrderRequestModel param, CustomError error)
        {
            if (param.OrderId == null)
            {
                error.AddError("OrderId", "OrderId is required");
            }
            if (param.OrderDate == null)
            {
                error.AddError("OrderDate", "วันที่ออเดอร์เป็นข้อมูลที่จำเป็น");
            }
            if (param.OrderDate != null && param.OrderDate > DateTime.UtcNow)
            {
                error.AddError("OrderDate", "วันที่ออเดอร์ต้องไม่เป็นอนาคต");
            }
            if (!string.IsNullOrWhiteSpace(param.Status) && !EnumOrderStatus.All.Contains(param.Status))
            {
                error.AddError("Status", $"สถานะออเดอร์ไม่ถูกต้อง ต้องเป็นหนึ่งใน: {string.Join(", ", EnumOrderStatus.All)}");
            }
        }

        public async Task<OrderManageViewModel> DeleteOrder(DeleteOrderRequestModel param, CustomError error)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.OrderId == param.OrderId);

            if (order == null)
            {
                error.AddError("Order", "ไม่พบออเดอร์");
            }
            error.ThrowIfError();
            // Return stock back to products
            foreach (var item in order.OrderItems)
            {
                if (item.Product != null)
                {
                    item.Product.StockQty += item.Qty;
                }
            }

            _context.OrderItems.RemoveRange(order.OrderItems);
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return new OrderManageViewModel
            {
                IsSuccess = true,
                Message = "ลบออเดอร์เรียบร้อยแล้ว",
                OrderId = param.OrderId
            };
        }
    }
}

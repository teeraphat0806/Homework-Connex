using Homework.Domain.Interfaces.Services.OrderServices;
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
    public class QueryOrderService : IQueryOrderService
    {
        private readonly postgresContext _context;
        private readonly CustomError _error;
        public QueryOrderService(postgresContext context,CustomError error)
        {
            _context = context;
            _error = error;
        }

        public async Task<List<OrderListViewModel>> GetOrderList(GetOrderListRequestModel request,CustomError error)
        {
            var query = _context.Orders.AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.Keyword))
            {
                query = query.Where(x => x.OrderNo.Contains(request.Keyword) || x.Status.Contains(request.Keyword));
            }

            return await query
                .OrderByDescending(x => x.OrderId)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(x => new OrderListViewModel
                {
                    OrderId = x.OrderId,
                    OrderNo = x.OrderNo,
                    OrderDate = x.OrderDate,
                    TotalAmount = x.TotalAmount,
                    VatAmount = x.VatAmount,
                    Status = x.Status
                })
                .ToListAsync();
        }

        public async Task<OrderInfoViewModel?> GetOrderInfo(GetOrderInfoRequestModel request, CustomError error)
        {
            var order = await _context.Orders
                .Where(x => x.OrderId == request.OrderId)
                .Select(x => new
                {
                    x.OrderId,
                    x.OrderNo,
                    x.OrderDate,
                    x.TotalAmount,
                    x.VatAmount,
                    x.Status,
                    OrderItems = x.OrderItems.Select(item => new
                    {
                        item.OrderItemId,
                        ProductId = item.ProductVariant.ProductId,
                        item.Qty,
                        item.UnitPrice,
                        item.Discount,
                        item.NetAmount,
                        item.OrderItemStatus
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (order == null)
            {
                return null;
            }

            var productIds = order.OrderItems.Select(oi => oi.ProductId).ToList();
            var products = await _context.Products
                .Where(p => productIds.Contains(p.ProductId))
                .ToDictionaryAsync(p => p.ProductId, p => p.Name);

            return new OrderInfoViewModel
            {
                OrderId = order.OrderId,
                OrderNo = order.OrderNo,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                VatAmount = order.VatAmount,
                Status = order.Status,
                OrderItems = order.OrderItems.Select(item => new OrderItemViewModel
                {
                    OrderItemId = item.OrderItemId,
                    ProductId = item.ProductId,
                    ProductName = products.ContainsKey(item.ProductId) ? products[item.ProductId] : string.Empty,
                    Qty = item.Qty,
                    UnitPrice = item.UnitPrice,
                    Discount = item.Discount,
                    NetAmount = item.NetAmount,
                    OrderItemStatus = item.OrderItemStatus
                }).ToList()
            };
        }
    }
}

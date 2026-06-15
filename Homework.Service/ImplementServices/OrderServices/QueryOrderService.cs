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

        public async Task<object> GetOrderList(GetOrderListRequestModel param, CustomError error)
        {
            var queryDb = _context.Orders.AsQueryable();

            if (!string.IsNullOrWhiteSpace(param.Keyword))
            {
                queryDb = queryDb.Where(x =>
                    x.OrderNo.Contains(param.Keyword) ||
                    x.Status.Contains(param.Keyword));
            }

            if (!string.IsNullOrWhiteSpace(param.Status))
            {
                queryDb = queryDb.Where(x => x.Status == param.Status);
            }

            if (param.CategoryIds != null && param.CategoryIds.Any())
            {
                queryDb = queryDb.Where(x =>
                    x.OrderItems.Any(oi =>
                        oi.Product != null &&
                        oi.Product.ProductCategoryMapping.Any(m =>
                            param.CategoryIds.Contains(m.CategoryId))));
            }

            if (param.StartDate.HasValue)
            {
                queryDb = queryDb.Where(x => x.OrderDate >= param.StartDate.Value);
            }

            if (param.EndDate.HasValue)
            {
                queryDb = queryDb.Where(x => x.OrderDate <= param.EndDate.Value);
            }

            var orderQuery = queryDb.Select(x => new OrderListViewModel
            {
                OrderId = x.OrderId,
                OrderNo = x.OrderNo,
                OrderDate = x.OrderDate,
                TotalAmount = x.TotalAmount,
                VatAmount = x.VatAmount,
                Status = x.Status,
                OrderItems = x.OrderItems.Select(item => new OrderItemViewModel
                {
                    OrderItemId = item.OrderItemId,
                    ProductId = item.ProductId ?? 0,
                    ProductName = item.Product != null ? item.Product.Name : string.Empty,
                    Qty = item.Qty,
                    UnitPrice = item.UnitPrice,
                    Discount = item.Discount,
                    NetAmount = item.NetAmount,
                    OrderItemStatus = item.OrderItemStatus
                }).ToList()
            });

            var loadOptions = param.LoadOptions ?? new DevExtreme.AspNet.Data.DataSourceLoadOptionsBase();
            var result = await DevExtreme.AspNet.Data.DataSourceLoader.LoadAsync(orderQuery, loadOptions);
            return result;
        }

        public async Task<OrderInfoViewModel?> GetOrderInfo(GetOrderInfoRequestModel param, CustomError error)
        {
            var order = await _context.Orders
                .Where(x => x.OrderId == param.OrderId)
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
                        ProductId = item.ProductId ?? 0,
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

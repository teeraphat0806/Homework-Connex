using System;
using System.Collections.Generic;

namespace Homework.Domain.ViewModels.OrderViewModels
{
    public class OrderManageViewModel
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = null!;
        public long? OrderId { get; set; }
    }

    public class OrderListViewModel
    {
        public long OrderId { get; set; }
        public string OrderNo { get; set; } = null!;
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal VatAmount { get; set; }
        public string Status { get; set; } = null!;
    }

    public class OrderInfoViewModel
    {
        public long OrderId { get; set; }
        public string OrderNo { get; set; } = null!;
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal VatAmount { get; set; }
        public string Status { get; set; } = null!;
        public List<OrderItemViewModel> OrderItems { get; set; } = new List<OrderItemViewModel>();
    }

    public class OrderItemViewModel
    {
        public long OrderItemId { get; set; }
        public long ProductId { get; set; }
        public string ProductName { get; set; } = null!;
        public int Qty { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Discount { get; set; }
        public decimal NetAmount { get; set; }
        public string OrderItemStatus { get; set; } = null!;
    }
}

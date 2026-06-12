using System;
using System.Collections.Generic;

namespace Homework.Domain.RequestModels.OrderRequestModels
{
    public class CreateOrderRequestModel
    {
        public List<CreateOrderItemRequestModel> OrderItems { get; set; } = new List<CreateOrderItemRequestModel>();
    }

    public class CreateOrderItemRequestModel
    {
        public long ProductId { get; set; }
        public int Qty { get; set; }
        public decimal Discount { get; set; }
    }

    public class GetOrderListRequestModel
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Keyword { get; set; }
    }

    public class GetOrderInfoRequestModel
    {
        public long OrderId { get; set; }
    }

    public class UpdateOrderRequestModel
    {
        public long OrderId { get; set; }
        public string Status { get; set; } = null!;
    }

    public class DeleteOrderRequestModel
    {
        public long OrderId { get; set; }
    }
}

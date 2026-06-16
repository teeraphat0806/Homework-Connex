using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homework.Domain.RequestModels.OrderRequestModels
{
    public class UpdateOrderItemRequestModel
    {
        public long? OrderItemId { get; set; }

        public long ProductId { get; set; }

        public int Qty { get; set; }

        public decimal Price { get; set; }

        public string? OrderItemStatus { get; set; }
    }
}

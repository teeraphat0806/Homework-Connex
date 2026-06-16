using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homework.Domain.RequestModels.OrderRequestModels
{
    public class UpdateOrderRequestModel
    {
        public long OrderId { get; set; }

        public DateTime? OrderDate { get; set; }

        public string? Status { get; set; }

        public List<UpdateOrderItemRequestModel> OrderItems { get; set; } = new();
    }
}

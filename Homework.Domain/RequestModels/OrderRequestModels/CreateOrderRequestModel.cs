using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homework.Domain.RequestModels.OrderRequestModels
{
    public class CreateOrderRequestModel
    {
        public DateTime? OrderDate { get; set; }

        public string? Status { get; set; }

        public List<CreateOrderItemRequestModel> OrderItems { get; set; } = new();
    }
}

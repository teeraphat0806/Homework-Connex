using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homework.Domain.RequestModels.OrderRequestModels
{
    public class ReturnOrderRequestModel
    {
        public long OrderId { get; set; }
        public List<ReturnOrderItemRequestModel> Items { get; set; } = new();
    }
}

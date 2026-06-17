using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homework.Domain.RequestModels.OrderRequestModels
{
    public class ReturnOrderItemRequestModel
    {
        public long OrderItemId { get; set; }
        public int ReturnQty { get; set; }
    }
}

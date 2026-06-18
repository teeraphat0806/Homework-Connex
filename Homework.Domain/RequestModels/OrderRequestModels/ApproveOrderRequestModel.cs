using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homework.Domain.RequestModels.OrderRequestModels
{
    public class ApproveOrderRequestModel
    {
        public long OrderId { get; set; }
        public List<ApproveOrderItemDecisionModel>? Items { get; set; } = new();
    }

    public class ApproveOrderItemDecisionModel
    {
        public long OrderItemId { get; set; }
        public string Status { get; set; }
        public int? Qty { get; set; }
        public string? RejectedReason { get; set; }
    }
}

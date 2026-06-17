using Homework.Domain.RequestModels.OrderRequestModels;
using Homework.Domain.Error;
using System;
using System.Linq;

namespace Homework.Domain.ValidateModels.OrderValidateModels
{
    public class CreateOrderValidateModel
    {
        public static void Validate(CreateOrderRequestModel param, CustomError error)
        {
            
        }
    }

    public class UpdateOrderValidateModel
    {
        public static void Validate(UpdateOrderRequestModel param, CustomError error)
        {
            if (param.OrderId <= 0)
            {
                error.AddError("OrderId", "รหัสออเดอร์ไม่ถูกต้อง");
            }
            if (string.IsNullOrWhiteSpace(param.Status))
            {
                error.AddError("Status", "กรุณาระบุสถานะของออเดอร์");
            }
        }
    }
}

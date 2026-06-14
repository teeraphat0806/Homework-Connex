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
            if (param.OrderItems == null || !param.OrderItems.Any())
            {
                error.AddError("Order", "ออเดอร์ต้องมีอย่างน้อย 1 รายการ");
                return;
            }

            for (int i = 0; i < param.OrderItems.Count; i++)
            {
                var item = param.OrderItems[i];
                if (item.ProductId <= 0)
                {
                    error.AddError($"OrderItems[{i}].ProductId", $"รหัสสินค้ารายการที่ {i + 1} ไม่ถูกต้อง");
                }
                if (item.Qty <= 0)
                {
                    error.AddError($"OrderItems[{i}].Qty", $"จำนวนสินค้ารายการที่ {i + 1} ต้องมากกว่า 0");
                }
                if (item.Discount < 0)
                {
                    error.AddError($"OrderItems[{i}].Discount", $"ส่วนลดรายการที่ {i + 1} ต้องไม่น้อยกว่า 0");
                }
            }
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

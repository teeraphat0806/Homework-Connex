namespace Homework.Domain.Enum
{

    /// สถานะสำหรับใบเบิกหลัก (Orders.Status)

    public class EnumOrderStatus
    {
        public const string Draft = "Draft";
        public const string Submit = "Submit";
        public const string Pending = "Pending"; 
        public const string Approved = "Approved";
        public const string Rejected = "Rejected";
        public const string ConfirmOrder = "Confirm Order";
    }

  
    /// สถานะสำหรับรายการสินค้าแต่ละแถว (OrderItemStatusCode)

    public class EnumOrderItemStatus
    {
        public const string Pending = "PENDING";
        public const string Approved = "APPROVED";
        public const string Rejected = "REJECTED";
    }
}

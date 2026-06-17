namespace Homework.Domain.Enum
{

    /// สถานะสำหรับใบเบิกหลัก (Orders.Status)

    public static class EnumOrderStatus
    {
        public const string Draft = "Draft";
        public const string Pending = "Pending"; 
        public const string Approved = "Approved";
        public const string Rejected = "Rejected";
        public const string Cancelled = "Cancelled";
        public const string PartialReturned = "PartialReturned";
        public const string Returned = "Returned";
        public static readonly string[] All =
        {
            Draft,
            Pending,
            Approved,
            Rejected,
            Cancelled,
            PartialReturned,
            Returned
        };
    }

  
    /// สถานะสำหรับรายการสินค้าแต่ละแถว (OrderItemStatusCode)

    public static class EnumOrderItemStatus
    {
        public const string Pending = "Pending";
        public const string Approved = "Approved";
        public const string Rejected = "Rejected";
        public const string Cancelled = "Cancelled";
        public const string PartialReturned = "PartialReturned";
        public const string Returned = "Returned";
        public static readonly string[] All =
        {
            Pending,
            Approved,
            Rejected,
            Cancelled,
            PartialReturned,
            Returned
        };
    }
}

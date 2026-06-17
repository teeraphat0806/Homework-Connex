using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homework.Domain.Enum
{
    public static class EnumStockTransactionType
    {
        public const string Issue = "ISSUE";
        public const string Return = "RETURN";
        //public const string Receive = "RECEIVE";
        public const string Adjust = "ADJUST";
        public static readonly string[] All = {
            Issue,
            Return,
            //Receive,
            Adjust
        };
    }

    public static class EnumStockTransactionStatus
    {
        public const string Pending = "PENDING";
        public const string Approved = "APPROVED";
        public const string Cancelled = "CANCELLED";
        public static readonly string[] All = {
            Pending,
            Approved,
            Cancelled
        };
    }
}

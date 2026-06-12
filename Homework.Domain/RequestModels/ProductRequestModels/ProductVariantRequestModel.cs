using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homework.Domain.RequestModels.ProductRequestModels
{
    public class ProductVariantRequestModel
    {
        public string VariantCode { get; set; } = string.Empty;
        public string VariantName { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal Cost { get; set; }
        public int StockQty { get; set; }
    }
}

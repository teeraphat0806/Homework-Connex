using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homework.Domain.ViewModels.ProductViewModels
{
   
    public class ProductVariantViewModel
    {
        public long ProductVariantId { get; set; }
        public string VariantCode { get; set; }
        public string VariantName { get; set; }
        public string Color { get; set; }
        public decimal Price { get; set; }
        public int StockQty { get; set; }
        public bool IsActive { get; set; }
    }
}

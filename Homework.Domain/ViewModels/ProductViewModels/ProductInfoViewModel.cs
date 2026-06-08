using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homework.Domain.ViewModels.ProductViewModels
{
    public class ProductInfoViewModel
    {
        public long ProductId { get; set; }
        public string SKU { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public decimal Cost { get; set; }
        public int StockQty { get; set; }
        public long? CategoryId { get; set; }
        public bool IsActive { get; set; }
    }
}

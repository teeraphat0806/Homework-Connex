using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homework.Domain.ViewModels.ProductViewModels
{
    public class ProductListViewModel
    {
        public long ProductId { get; set; }
        public string SKU { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int StockQty { get; set; }
        public bool IsActive { get; set; }
    }
}

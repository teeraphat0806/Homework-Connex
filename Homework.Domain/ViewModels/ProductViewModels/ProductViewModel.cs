using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homework.Domain.ViewModels.ProductViewModels
{
    public class ProductViewModel
    {
        public long ProductId { get; set; }
        public string ProductCode { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public long? CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public List<long> CategoryIds { get; set; } = new List<long>();
        public List<string> CategoryNames { get; set; } = new List<string>();
        public bool IsActive { get; set; }
        public decimal Price { get; set; }
        public int StockQty { get; set; }
        public string? ImageUrl { get; set; }
    }
}

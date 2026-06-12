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
        public bool IsActive { get; set; }
        public List<ProductVariantViewModel> Variants { get; set; } = new List<ProductVariantViewModel>();
    }
}

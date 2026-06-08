using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homework.Domain.ViewModels.ProductViewModels
{
    public class ProductManageViewModel
    {
        public bool IsSuccess { get; set; }
        public string? Message { get; set; }
        public long? ProductId { get; set; }
    }
}

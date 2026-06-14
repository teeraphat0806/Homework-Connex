using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homework.Domain.RequestModels.ProductRequestModels
{
    public class CreateProductRequestModel
    {
        
            public string ProductCode { get; set; } = string.Empty;

            public string Name { get; set; } = string.Empty;

            public string? Description { get; set; }

            public decimal Price { get; set; }

            public int StockQty { get; set; }

            public long? CategoryId { get; set; }

            public List<long> CategoryIds { get; set; } = new List<long>();

            public string? ImageUrl { get; set; }
    }
}

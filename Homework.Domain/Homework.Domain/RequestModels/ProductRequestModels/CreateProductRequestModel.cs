using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homework.Domain.RequestModels.ProductRequestModels
{
    public class CreateProductRequestModel
    {
        
            public string SKu { get; set; } = string.Empty;

            public string Name { get; set; } = string.Empty;

            public string? Description { get; set; }

            public decimal Price { get; set; }

            public decimal Cost { get; set; }

            public int StockQty { get; set; }

            public long? CategoryId { get; set; }
        
    }
}

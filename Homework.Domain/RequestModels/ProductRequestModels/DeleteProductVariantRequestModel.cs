using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homework.Domain.RequestModels.ProductRequestModels
{
    public class DeleteProductVariantRequestModel
    {
        public long ProductId { get; set; }
        public long ProductVariantId { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DevExtreme.AspNet.Data;

namespace Homework.Domain.RequestModels.ProductRequestModels
{
    public class GetProductListRequestModel
    {
        public string? Keyword { get; set; }

        public long? CategoryId { get; set; }

        public List<long>? CategoryIds { get; set; }

        public bool? IsActive { get; set; }

        public int PageNumber { get; set; } = 1;

        public int PageSize { get; set; } = 20;

        public DataSourceLoadOptionsBase? LoadOptions { get; set; }
    }
}

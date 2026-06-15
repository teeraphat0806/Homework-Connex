using System;
using System.Collections.Generic;
using DevExtreme.AspNet.Data;
namespace Homework.Domain.RequestModels.OrderRequestModels
{
    public class GetOrderListRequestModel
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Keyword { get; set; }
        public DataSourceLoadOptionsBase? LoadOptions { get; set; }
    }


    
}

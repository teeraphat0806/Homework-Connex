using System;
using System.Collections.Generic;
using DevExtreme.AspNet.Data;
namespace Homework.Domain.RequestModels.OrderRequestModels
{
    public class GetOrderListRequestModel
    {
        public string? Keyword { get; set; }
        public string? Status { get; set; } 
        public List<long>? CategoryIds { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DataSourceLoadOptionsBase? LoadOptions { get; set; }
    }


    
}

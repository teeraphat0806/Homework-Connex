using System.Collections.Generic;
using System.Threading.Tasks;
using Homework.Domain.RequestModels.OrderRequestModels;
using Homework.Domain.ViewModels.OrderViewModels;
using Homework.Domain.Error;
namespace Homework.Domain.Interfaces.Services.OrderServices
{
    public interface IQueryOrderService
    {
        Task<object> GetOrderList(GetOrderListRequestModel param,CustomError error);
        Task<OrderInfoViewModel?> GetOrderInfo(GetOrderInfoRequestModel param,CustomError error);
    }
}

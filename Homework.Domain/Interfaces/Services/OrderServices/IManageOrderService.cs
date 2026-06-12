using System.Threading.Tasks;
using Homework.Domain.RequestModels.OrderRequestModels;
using Homework.Domain.ViewModels.OrderViewModels;
using Homework.Domain.Error;
namespace Homework.Domain.Interfaces.Services.OrderServices
{
    public interface IManageOrderService
    {
        Task<OrderManageViewModel> CreateOrder(CreateOrderRequestModel request,CustomError error);
        Task<OrderManageViewModel> UpdateOrder(UpdateOrderRequestModel request,CustomError error);
        Task<OrderManageViewModel> DeleteOrder(DeleteOrderRequestModel request,CustomError error);
    }
}

using Homework.Domain.Error;
using Homework.Domain.Models;
using Homework.Domain.RequestModels.OrderRequestModels;
using Homework.Domain.ViewModels.OrderViewModels;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
namespace Homework.Domain.Interfaces.Services.OrderServices
{
    public interface IManageOrderService
    {
        Task<OrderManageViewModel> CreateOrder(CreateOrderRequestModel request,CustomError error);
        Task<OrderManageViewModel> UpdateOrder(UpdateOrderRequestModel request,CustomError error);
        Task<OrderManageViewModel> DeleteOrder(DeleteOrderRequestModel request, CustomError error);
        Task<OrderManageViewModel> ApproveOrder(ApproveOrderRequestModel request, CustomError error);
        Task<OrderManageViewModel> RejectOrder(RejectOrderRequestModel request, CustomError error);
        Task<OrderManageViewModel> CancelOrder(CancelOrderRequestModel request, CustomError error);
        Task<OrderManageViewModel> ReturnOrder(ReturnOrderRequestModel request, CustomError error);
        Task<OrderManageViewModel> SubmitOrder(SubmitOrderRequestModel param, CustomError error);
    }
}

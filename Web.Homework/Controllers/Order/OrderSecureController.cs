using Homework.Domain.Error;
using Homework.Domain.Interfaces.Services.AuthenticationServices;
using Homework.Domain.Interfaces.Services.PermissionServices;
using Homework.Service.ImplementServices.Authentications.Repositories;
using Microsoft.AspNetCore.Authorization;
using Homework.Domain.Interfaces.Services.OrderServices;
using Homework.Domain.RequestModels.OrderRequestModels;
using Microsoft.AspNetCore.Mvc;
namespace Web.Homework.Controllers.Order{
    [Authorize]
    [ApiController]
    [Route("api/order")]
    public class OrderController : ControllerBase
    {
        private readonly IQueryOrderService _queryOrderService;
        private readonly IManageOrderService _manageOrderService;

        public OrderController(
            IQueryOrderService queryOrderService,
            IManageOrderService manageOrderService)
        {
            _queryOrderService = queryOrderService;
            _manageOrderService = manageOrderService;
        }
        [HttpGet("list")]
        public async Task<IActionResult> GetOrderList([FromQuery] GetOrderListRequestModel request)
        {
            var error = new CustomError();
            var result = await _queryOrderService.GetOrderList(request, error);
            return Ok(result);
        }
        [HttpGet("info")]
        public async Task<IActionResult> GetOrderInfo([FromQuery] GetOrderInfoRequestModel request)
        {
            var error = new CustomError();
            var result = await _queryOrderService.GetOrderInfo(request, error);
            if (result == null)
            {
                return NotFound("Order not found");
            }
            return Ok(result);
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequestModel request)
        {
            var error = new CustomError();
            var result = await _manageOrderService.CreateOrder(request, error);
            return Ok(result);
        }
        [HttpPost("update")]
        public async Task<IActionResult> UpdateOrder([FromBody] UpdateOrderRequestModel request)
        {
            var error = new CustomError();
            var result = await _manageOrderService.UpdateOrder(request, error);
            return Ok(result);
        }
        [HttpPost("delete")]
        public async Task<IActionResult> DeleteOrder([FromBody] DeleteOrderRequestModel request)
        {
            var error = new CustomError();
            var result = await _manageOrderService.DeleteOrder(request, error);
            return Ok(result);
        }
        [HttpPost("order/{id}")]
        public async Task<IActionResult> DeleteOrder(long id)
        {
            var error = new CustomError();
            var request = new DeleteOrderRequestModel
            {
                OrderId = id
            };

            var result = await _manageOrderService.DeleteOrder(request, error);
            return Ok(result);
        }
    }
}
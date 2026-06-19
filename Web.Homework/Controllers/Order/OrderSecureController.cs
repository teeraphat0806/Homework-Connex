using Homework.Domain.Error;
using Homework.Domain.Interfaces.Services.AuthenticationServices;
using Homework.Domain.Interfaces.Services.OrderServices;
using Homework.Domain.Interfaces.Services.PermissionServices;
using Homework.Domain.RequestModels.OrderRequestModels;
using Homework.Service.ImplementServices.Authentications.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static System.Runtime.InteropServices.JavaScript.JSType;
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
        [HttpGet("next-order-no")]
        public async Task<IActionResult> GetNextOrderNo()
        {
            var error = new CustomError();
            var result = await _queryOrderService.GetNextOrderNo(error);
            return Ok(new { nextOrderNo = result });
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
        [Authorize(Roles = "ADMIN")]
        [HttpPost("approve")]
        public async Task<IActionResult> ApproveOrder([FromBody] ApproveOrderRequestModel request)
        {
            var error = new CustomError();
            var result = await _manageOrderService.ApproveOrder(request, error);
            return Ok(result);
        }
        [Authorize(Roles = "ADMIN")]
        [HttpPost("reject")]
        public async Task<IActionResult> RejectOrder([FromBody] RejectOrderRequestModel request)
        {
            var error = new CustomError();
            var result = await _manageOrderService.RejectOrder(request, error);
            return Ok(result);
        }
        [HttpPost("cancel")]
        public async Task<IActionResult> CancelOrder([FromBody] CancelOrderRequestModel request)
        {
            var error = new CustomError();
            var result = await _manageOrderService.CancelOrder(request, error);
            return Ok(result);
        }
        [HttpPost("return")]
        public async Task<IActionResult> ReturnOrder([FromBody] ReturnOrderRequestModel request)
        {
            var error = new CustomError();
            var result = await _manageOrderService.ReturnOrder(request, error);
            return Ok(result);
        }
        [HttpPost("submit")]
        public async Task<IActionResult> SubmitOrder([FromBody] SubmitOrderRequestModel request)
        {
            var error = new CustomError();
            var result = await _manageOrderService.SubmitOrder(request, error);
            return Ok(result);
        }
    }
}
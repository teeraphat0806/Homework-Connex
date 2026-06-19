using Homework.Domain.Interfaces.Services.ProductServices;
using Homework.Domain.RequestModels.ProductRequestModels;
using Homework.Domain.ViewModels.ProductViewModels;
using Homework.Domain.Error;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Web.Homework.Controllers.Product
{
    [Authorize]
    [ApiController]
    [Route("api/product")]
    public class ProductController : ControllerBase
    {
        private readonly IQueryProductService _queryProductService;
        private readonly IManageProductService _manageProductService;

        public ProductController(
            IQueryProductService queryProductService,
            IManageProductService manageProductService)
        {
            _queryProductService = queryProductService;
            _manageProductService = manageProductService;
        }

        [HttpGet("list")]
        public async Task<IActionResult> GetProductList([FromQuery] GetProductListRequestModel request)
        {
            var error = new CustomError();
            var result = await _queryProductService.GetProductList(request, error);
            return Ok(result);
        }

        [HttpGet("info")]
        public async Task<IActionResult> GetProductInfo([FromQuery] GetProductInfoRequestModel request)
        {
            var error = new CustomError();
            var result = await _queryProductService.GetProductInfo(request, error);
            if (result == null)
            {
                return NotFound("Product not found");
            }
            return Ok(result);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPost("create")]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductRequestModel request)
        {
            var error = new CustomError();
            var result = await _manageProductService.CreateProduct(request, error);
            return Ok(result);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPost("update")]
        public async Task<IActionResult> UpdateProduct([FromBody] UpdateProductRequestModel request)
        {
            var error = new CustomError();
            var result = await _manageProductService.UpdateProduct(request, error);
            return Ok(result);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPost("delete")]
        public async Task<IActionResult> DeleteProduct([FromBody] DeleteProductRequestModel request)
        {
            var error = new CustomError();
            var result = await _manageProductService.DeleteProduct(request, error);
            return Ok(result);
        }
    }
}

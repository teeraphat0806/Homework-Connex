using Homework.Domain.Interfaces.Services.CategoriesServices;
using Homework.Domain.RequestModels.CategoriesRequestModels;
using Homework.Domain.Error;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Web.Homework.Controllers.Categories
{
    [Authorize]
    [ApiController]
    [Route("api/categories")]
    public class CategoriesSecureController : ControllerBase
    {
        private readonly IQueryCategoriesService _queryCategoriesService;

        public CategoriesSecureController(IQueryCategoriesService queryCategoriesService)
        {
            _queryCategoriesService = queryCategoriesService;
        }

        [HttpGet("list")]
        public async Task<IActionResult> GetCategoriesList([FromQuery] GetCategoriesRequestModel request)
        {
            var error = new CustomError();
            var result = await _queryCategoriesService.GetCategoriesList(request, error);
            return Ok(result);
        }
    }
}

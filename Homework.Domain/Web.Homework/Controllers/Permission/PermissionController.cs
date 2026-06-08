using Homework.Domain.Error;
using Homework.Domain.Interfaces.Services.AuthenticationServices;
using Homework.Domain.Interfaces.Services.PermissionServices;
using Homework.Domain.RequestModels.PermissionRequestModels;
using Homework.Service.ImplementServices.Authentications.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace Web.Homework.Controllers.Permission
{
    [Route("api/[controller]")]
    [ApiController]
    public class PermissionController : ControllerBase
    {
        private readonly IPermissionAuthorizeService _permissionService;

        public PermissionController(IPermissionAuthorizeService permissionService)
        {
            _permissionService = permissionService;
        }
        [Authorize]
        [HttpPost("priv-page-check")]
        public async Task<IActionResult> PrivPageCheck(
        [FromBody] PermissionRequestModel param)
        {
            var error = new CustomError();

            var result =
                await _permissionService.AuthorizeAsync(
                    param,
                    error
                );

            return Ok(result);
        }
    }
}

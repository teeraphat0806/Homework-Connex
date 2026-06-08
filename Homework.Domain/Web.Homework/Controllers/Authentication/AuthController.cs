using Homework.Domain.Error;
using Homework.Domain.Interfaces.Services.AuthenticationServices;
using Homework.Domain.RequestModels.AuthenticationRequestModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace Web.Homework.Controllers.Authentication
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestModel param)
        {
            var error = new CustomError();
            var result = await _authService.LoginUser(param, error);
            return Ok();
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestModel param)
        {
            var error = new CustomError();
            var result = await _authService.RegisterUser(param, error);
            return Ok(result);
        }
        [Authorize]
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        {
            var error = new CustomError();
            var result = await _authService.RefreshToken(error);
            return Ok(result);
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var error = new CustomError();
            var result = await _authService.LogOut(error);
            return Ok(result);
        }
        [Authorize]
        [HttpPost("is-session-valid")]
        public async Task<IActionResult> IsSessionValid()
        {
            var error = new CustomError();
            var result = await _authService.IsSessionValid(error);
            return Ok(result);
        }

        //[Authorize]
        //[HttpPost("get-user-profile")]
        //public async Task<IActionResult> GetUserProfile([FromBody] GetUserProfileRequestModel param)
        //{
        //    var error = new CustomError();
        //    var result = await _authService.GetUserProfile(param, error);
        //    return Ok(result);
        //}
        [Authorize]
        [HttpPost("get-user-profile")]
        public async Task<IActionResult> GetUserProfile()
        {
            var error = new CustomError();
            var result = await _authService.GetUserProfile(error);
            return Ok(result);
        }
    }
}

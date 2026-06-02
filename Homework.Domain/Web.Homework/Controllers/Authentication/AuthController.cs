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
            CustomError error = new CustomError();
            try
            {
                var result = await _authService.LoginUser(param, error);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestModel param)
        {
            CustomError error = new CustomError();
            try
            {
                var result = await _authService.RegisterUser(param, error);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [Authorize]
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestModel param)
        {
            CustomError error = new CustomError();

            var result = await _authService.RefreshToken(error);
            if (result == null)
            {
                error.AddError("Invalid refresh token.");
                error.ThrowIfError();
            }
            return Ok(result);

        }
        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            CustomError error = new CustomError();
            try
            {
                var result = await _authService.LogOut(error);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [Authorize]
        [HttpPost("is-session-valid")]
        public async Task<IActionResult> IsSessionValid()
        {
            CustomError error = new CustomError();
            try
            {
                var result = await _authService.IsSessionValid(error);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [Authorize]
        [HttpPost("get-user-profile")]
        public async Task<IActionResult> GetUserProfile([FromBody] GetUserProfileRequestModel param)
        {
            CustomError error = new CustomError();
            try
            {
                var result = await _authService.GetUserProfile(param, error);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}

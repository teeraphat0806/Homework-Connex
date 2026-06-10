using Homework.Domain.Interfaces.Services.NavbarServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Web.Homework.Controllers.Navbar
{
    [ApiController]
    [AllowAnonymous]
    [Route("api/navbar")]
    public class NavbarController : ControllerBase
    {
        private readonly INavbarService _navbarService;

        public NavbarController(INavbarService navbarService)
        {
            _navbarService = navbarService;
        }
        [HttpGet("prelogin")]
        public async Task<IActionResult> GetPreLoginMenusAsync()
        {
            var menus = await _navbarService.GetPreLoginNavBar();
            return Ok(menus);
        }
    }
}

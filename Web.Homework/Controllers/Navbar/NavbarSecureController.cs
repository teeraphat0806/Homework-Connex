using Homework.Domain.Interfaces.Services.NavbarServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Web.Homework.Controllers.Navbar
{
    [Authorize]
    [ApiController]
    [Route("api/navbar")]
    public class NavbarSecureController : ControllerBase
    {
        private readonly INavbarService _navbarService;

        public NavbarSecureController(INavbarService navbarService)
        {
            _navbarService = navbarService;
        }

        [HttpGet("menus")]
        public async Task<IActionResult> GetMenusAsync()
        {
            var menus = await _navbarService.GetNavBar();
            return Ok(menus);
        }
    }
}
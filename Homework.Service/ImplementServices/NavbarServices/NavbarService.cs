using Homework.Domain.Interfaces.RawSqlServices;
using Homework.Domain.Interfaces.Services.NavbarServices;
using Homework.Domain.Interfaces.Services.UserServices;
using Homework.Domain.ViewModels.NavbarViewModels;

namespace Homework.Service.ImplementServices.NavbarServices
{
    public class NavbarService : INavbarService
    {
        private readonly IRawSqlService _rawSqlService;
        private readonly IUserContextService _userContextService;

        public NavbarService(
            IRawSqlService rawSqlService,
            IUserContextService userContextService)
        {
            _rawSqlService = rawSqlService;
            _userContextService = userContextService;
        }

        public async Task<List<NavbarViewModels>> GetNavBar()
        {
            var userRole = _userContextService.GetCurrentRoleFromToken();

            if (string.IsNullOrEmpty(userRole))
            {
                return new List<NavbarViewModels>();
            }

            var menus = await _rawSqlService.QueryNavbarAsync(
                new[] { userRole }
            );

            return menus.Select(m => new NavbarViewModels
            {
                PageCode = m.PageCode,
                NavbarName = m.NavbarName,
                PageUrl  = m.PageUrl 
            }).ToList();
        }
        public async Task<List<NavbarViewModels>> GetPreLoginNavBar()
        {
            var menus = await _rawSqlService.QueryPreLoginNavbarAsync();

            return menus.Select(m => new NavbarViewModels
            {
                PageCode = m.PageCode,
                NavbarName = m.NavbarName,
                PageUrl  = m.PageUrl 
            }).ToList();
        }
    }
}
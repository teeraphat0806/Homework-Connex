using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Homework.Domain.ViewModels.NavbarViewModels;
namespace Homework.Domain.Interfaces.Services.NavbarServices
{
    public interface INavbarService
    {
        Task<List<NavbarViewModels>> GetNavBar();
        Task<List<NavbarViewModels>> GetPreLoginNavBar();
    }
}

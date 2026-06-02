using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Homework.Domain.ViewModels.AuthenticationViewModels;
using Homework.Domain.RequestModels.AuthenticationRequestModels;
using Homework.Domain.Error;
namespace Homework.Domain.Interfaces.Services.AuthenticationServices
{
    public interface IAuthService
    {
        Task<LoginViewModel> LoginUser(LoginRequestModel param ,CustomError error);
        Task<RegisterViewModel> RegisterUser(RegisterRequestModel param, CustomError error);
        Task<LoginViewModel> RefreshToken(CustomError error);
        Task<LogOutViewModel> LogOut (CustomError error);
        Task<SessionViewModel> IsSessionValid(CustomError error);
        Task RevokeAllSessions(CustomError error);
        Task RevokeAllSessionsByUserId(long userID,CustomError error);
        Task<UserViewModel> GetUserProfile(GetUserProfileRequestModel param,CustomError error);
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homework.Domain.ViewModels.AuthenticationViewModels
{
    public class LoginViewModel
    {
        public long UserId {  get; set; } 
        public string UserName { get; set; }
        public string Password { get; set; }
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public DateTime ExpiredTime { get; set; }
        public DateTime RevokedTime { get; set; }
    }
    public class RefreshTokenViewModel
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public DateTime ExpiredTime { get; set; }
        public DateTime RevokedTime { get; set; }
    }
  
    }
    public class RegisterViewModel
    {
        public long UserId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int? Age { get; set; }
        public string Phone { get; set; }
        public DateOnly? BirthDate { get; set; }
    }
    public class SessionViewModel
    {
        public Boolean IsValid { get; set; }
        public string Message { get; set; } = string.Empty;
    }
    public class UserViewModel
    {
        public long UserId { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int? Age { get; set; }
        public string Phone { get; set; }
        public DateOnly? BirthDate { get; set; }
    }
    public class LogOutViewModel
    {   public Boolean IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;
    }
    
}

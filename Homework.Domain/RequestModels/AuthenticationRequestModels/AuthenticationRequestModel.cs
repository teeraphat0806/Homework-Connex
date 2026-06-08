using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homework.Domain.RequestModels.AuthenticationRequestModels
{
    public class LoginRequestModel
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }
    public class  RefreshTokenRequestModel
    {
        public string RefreshToken { get; set; }
    }
    public class RegisterRequestModel
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int? Age { get; set; }
        public string Phone { get; set; }
        public DateOnly? BirthDate { get; set; }
    }
    public class GetUserProfileRequestModel
    {
        public int ? userId { get; set; }
    }

}

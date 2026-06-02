using Homework.Domain.RequestModels.AuthenticationRequestModels;
using Homework.Domain.Error;
using Homework.Domain.ViewModels.AuthenticationViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homework.Domain.ValidateModels.AuthenticationValidateModels
{
    public class LoginValidateModel
    {
        public static void Validate(LoginRequestModel param, CustomError error)
        {
           
        }
    }
    public class RegisterValidateModel 
    {
        public static void Validate(RegisterRequestModel param, CustomError error)
        {
            
        }
    }
}

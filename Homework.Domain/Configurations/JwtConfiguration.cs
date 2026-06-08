using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homework.Domain.Configurations
{
    public class JwtConfig
    {
      
        public int AccessTokenExpireMinutes { get; set; } = 2;
        public int RefreshTokenExpireDays { get; set; } = 10;

    }
}

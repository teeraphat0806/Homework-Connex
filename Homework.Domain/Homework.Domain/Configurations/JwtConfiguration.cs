using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homework.Domain.Configurations
{
    public class JwtConfig
    {
        public string Issuer { get; set; } = "https://localhost:5001";
        public string Audience { get; set; } = "https://localhost:5001";
        public string Key { get; set; } = "ThisIsASecretKeyForJwtTokenGeneration123456";
        public int AccessTokenExpireMinutes { get; set; } = 2;
        public int RefreshTokenExpireDays { get; set; } = 10;

    }
}

using Homework.Domain.Error;
using Homework.Domain.Interfaces.Services.AuthenticationServices;
using Homework.Domain.Models;
using Homework.Domain.RequestModels.AuthenticationRequestModels;
using Homework.Domain.ValidateModels.AuthenticationValidateModels;
using Homework.Domain.ViewModels.AuthenticationViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Homework.Service.ImplementServices.Authentications.Repositories
{
    public class AuthService : IAuthService
    {
        private readonly postgresContext _context;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthService(postgresContext context, IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<LoginViewModel> LoginUser(LoginRequestModel param, CustomError error)
        {

            if (param.UserName == null || param.Password == null)
            {
                error.AddErrorKeyAndToast("Login", "กรุณากรอก Username และ Password");
            }
            
            error.ThrowIfError();
            // check if user exists
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Username == param.UserName);

            if (user == null)
            {
                error.AddError("Username", "Username ไม่ถูกต้อง");
            }
            error.ThrowIfError();

            // check if password is correct
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(
                param.Password,
                user.Password
            );

            if (!isPasswordValid)
            {
                error.AddError("Password", "Password ไม่ถูกต้อง");
            }
            error.ThrowIfError();
            // validate input

            // update last checking time
            user.LastChecking = DateTime.UtcNow;

            // revoke all existing sessions
            await RevokeAllSessionsByUserId(user.UserId,error);

            // generate access token and refresh token
            string accessToken = GenerateAccessToken(user, error);
            string refreshToken = GenerateRefreshToken();

            // save refresh token to database
            var userRefreshToken = new UserRefreshToken
            {
                UserId = user.UserId,
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                CreatedTime = DateTime.UtcNow,
                ExpiredTime = DateTime.UtcNow.AddDays(
    Convert.ToDouble(_configuration["JwtConfig:RefreshTokenExpireDays"])
),
                RevokedTime = null
            };

            _context.UserRefreshTokens.Add(userRefreshToken);
            await _context.SaveChangesAsync();
            await SetJWTTokenService(accessToken, refreshToken);

            return new LoginViewModel
            {
                UserId = user.UserId,
                UserName = user.Username,
                ExpiredTime = userRefreshToken.ExpiredTime
            };
        }

        // helper methods 
        private string GenerateAccessToken(User user, CustomError error)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.Username)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["JwtConfig:Key"])
            );

            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtConfig:Issuer"],
                audience: _configuration["JwtConfig:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(
    Convert.ToDouble(_configuration["JwtConfig:AccessTokenExpireMinutes"])
),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            var randomBytes = RandomNumberGenerator.GetBytes(64);
            return Convert.ToBase64String(randomBytes);
        }

        public async Task<UserViewModel> GetUserProfile(GetUserProfileRequestModel param, CustomError error)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.UserId == param.userId);
            if (user == null)
            {
                error.AddError("User", "ไม่พบผู้ใช้งาน");
                error.ThrowIfError();
            }
            return new UserViewModel
            {
                UserId = user.UserId,
                UserName = user.Username,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Age = user.Age,
                Phone = user.Phone,
                BirthDate = user.BirthDate
            };
        }

        // register user
        public async Task<RegisterViewModel> RegisterUser(RegisterRequestModel param, CustomError error)
        {
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(x => x.Username == param.UserName);
            if (existingUser != null)
            {
                error.AddErrorKeyAndToast(
                    "UserName",
                    "Username นี้มีผู้ใช้งานแล้ว");
            }
            error.ThrowIfError();
            if (string.IsNullOrWhiteSpace(param.UserName))
                error.AddErrorKeyAndToast("UserName", "กรุณากรอก Username");

            if (string.IsNullOrWhiteSpace(param.Password))
                error.AddErrorKeyAndToast("Password", "กรุณากรอก Password");

            if (string.IsNullOrWhiteSpace(param.FirstName))
                error.AddErrorKeyAndToast("FirstName", "กรุณากรอกชื่อ");

            if (string.IsNullOrWhiteSpace(param.LastName))
                error.AddErrorKeyAndToast("LastName", "กรุณากรอกนามสกุล");

            if (string.IsNullOrWhiteSpace(param.Phone))
                error.AddErrorKeyAndToast("Phone", "กรุณากรอกเบอร์โทรศัพท์");

            if (param.Age.HasValue && (param.Age < 5 || param.Age > 180))
                error.AddErrorKeyAndToast("Age", "อายุ ต้องอยู่ระหว่าง 5 ถึง 180 ปี");

            if (param.BirthDate.HasValue &&
                param.BirthDate > DateOnly.FromDateTime(DateTime.Now))
                error.AddErrorKeyAndToast("BirthDate", "กรุณากรอกวันเกิดที่ถูกต้อง");

            if (!string.IsNullOrWhiteSpace(param.UserName))
            {
               

                if (!System.Text.RegularExpressions.Regex.IsMatch(param.UserName, @"^[a-zA-Z0-9]+$"))
                    error.AddErrorKeyAndToast("UserName", "Username ต้องประกอบด้วยตัวอักษรและตัวเลขเท่านั้น");

                if (System.Text.RegularExpressions.Regex.IsMatch(param.UserName, @"^\d+$"))
                    error.AddErrorKeyAndToast("UserName", "Username ต้องไม่ใช่ตัวเลขล้วน");
            }

            if (!string.IsNullOrWhiteSpace(param.Password))
            {
               

                if (!System.Text.RegularExpressions.Regex.IsMatch(param.Password, @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$"))
                    error.AddErrorKeyAndToast("Password", "Password ต้องมีตัวเล็ก ตัวใหญ่ ตัวเลข และอักขระพิเศษ");
            }

            if (!string.IsNullOrWhiteSpace(param.Phone) &&
                !System.Text.RegularExpressions.Regex.IsMatch(param.Phone, @"^\d{10}$"))
                error.AddErrorKeyAndToast("Phone", "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก");

            error.ThrowIfError();


            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(param.Password);
            var newUser = new User
            {
                Username = param.UserName,
                Password = hashedPassword,
                FirstName = param.FirstName,
                LastName = param.LastName,
                Age = param.Age,
                Phone = param.Phone,
                BirthDate = param.BirthDate,
                CreatedTime = DateTime.UtcNow
            };
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();
            return new RegisterViewModel
            {
                UserId = newUser.UserId,
                UserName = newUser.Username,
                FirstName = newUser.FirstName,
                LastName = newUser.LastName,
                Age = newUser.Age,
                Phone = newUser.Phone,
                BirthDate = newUser.BirthDate
            };
        }
        public async Task<LoginViewModel> RefreshToken(CustomError error)
        {
            // get access token and refresh token from cookie
            var request = _httpContextAccessor.HttpContext?.Request;
            var response = _httpContextAccessor.HttpContext?.Response;
            string? oldAccessToken = request?.Cookies["accessToken"];
            string? oldRefreshToken = request?.Cookies["refreshToken"];

            if (string.IsNullOrWhiteSpace(oldAccessToken) || string.IsNullOrWhiteSpace(oldRefreshToken))
            {
                error.AddError("Token", "ไม่มี access token หรือ refresh token");
                error.ThrowIfError();
            }
            var refreshtokenDb = await _context.UserRefreshTokens
                .Include(x => x.User)
                .FirstOrDefaultAsync(x => x.AccessToken == oldAccessToken && x.RefreshToken == oldRefreshToken);

            if (refreshtokenDb == null)
            {
                error.AddError("Token", "ไม่พบ access token หรือ refresh token ในระบบ");
                error.ThrowIfError();
            }
            if (refreshtokenDb.RevokedTime != null || refreshtokenDb.ExpiredTime < DateTime.UtcNow)
            {
                error.AddError("Token", "access token หรือ refresh token ไม่ถูกต้อง");
                error.ThrowIfError();
            }

            var user = refreshtokenDb.User;

            // Generate new access token 
            var newAccessToken = GenerateAccessToken(user, error);
            //Generate new refresh token
            var newRefreshToken = GenerateRefreshToken();

            // Update new access token and refresh token to database
            refreshtokenDb.AccessToken = newAccessToken;
            refreshtokenDb.RefreshToken = newRefreshToken;
            refreshtokenDb.CreatedTime = DateTime.UtcNow;
            refreshtokenDb.ExpiredTime = DateTime.UtcNow.AddDays(
            Convert.ToDouble(_configuration["JwtConfig:RefreshTokenExpireDays"]));

            // Revoke old access token and refresh token
            await _context.SaveChangesAsync();
            await SetJWTTokenService(newAccessToken, newRefreshToken);
            // Return new access token and refresh token
            return new LoginViewModel
            {
                UserId = user.UserId,
                UserName = user.Username,
                ExpiredTime = refreshtokenDb.ExpiredTime
            };

        }

        public async Task<SessionViewModel> IsSessionValid(CustomError error)
        {
            var request = _httpContextAccessor.HttpContext?.Request;
            string? accessToken = request?.Cookies["accessToken"];
            string? refreshToken = request?.Cookies["refreshToken"];
            if (string.IsNullOrWhiteSpace(accessToken))
            {
                return new SessionViewModel
                {
                    IsValid = false,
                    Message = "ไม่มี access token"
                };
            }
            if( string.IsNullOrWhiteSpace(refreshToken))
            {
                return new SessionViewModel
                {
                    IsValid = false,
                    Message = "ไม่มี refresh token"
                };
            }
            var refreshtokenDb = await _context.UserRefreshTokens
                .FirstOrDefaultAsync(x => x.AccessToken == accessToken &&
            x.RefreshToken == refreshToken);
            if (refreshtokenDb == null || refreshtokenDb.RevokedTime != null || refreshtokenDb.ExpiredTime < DateTime.UtcNow)
            {
                return new SessionViewModel
                {
                    IsValid = false,
                    Message = "session ไม่ถูกต้อง"
                };
            }
            return new SessionViewModel
            {
                IsValid = true,
                Message = "session valid"
            };
        }
        public async Task RevokeAllSessionsByUserId(long userId, CustomError error)
        {
            var userRefreshTokens = await _context.UserRefreshTokens
                .Where(x => x.UserId == userId && x.RevokedTime == null && x.ExpiredTime > DateTime.UtcNow)
                .ToListAsync();
            foreach (var token in userRefreshTokens)
            {
                token.RevokedTime = DateTime.UtcNow;
            }
            await _context.SaveChangesAsync();
        }
        public async Task RevokeAllSessions(CustomError error)
        {
            var request = _httpContextAccessor.HttpContext?.Request;
            var response = _httpContextAccessor.HttpContext?.Response;
            string? accessToken = request?.Cookies["accessToken"];
            if (string.IsNullOrWhiteSpace(accessToken))
            {
                error.AddError("Token", "ไม่มี access token");
                error.ThrowIfError();
            }
            var refreshtokenDb = await _context.UserRefreshTokens
                .FirstOrDefaultAsync(x => x.AccessToken == accessToken);
            if (refreshtokenDb == null)
            {
                error.AddError("Token", "ไม่พบ access token ในระบบ");
                error.ThrowIfError();
            }
            var userId = refreshtokenDb.UserId;
            var userRefreshTokens = await _context.UserRefreshTokens
                .Where(x => x.UserId == userId && x.RevokedTime == null && x.ExpiredTime > DateTime.UtcNow)
                .ToListAsync();
            foreach (var token in userRefreshTokens)
            {
                token.RevokedTime = DateTime.UtcNow;
            }
            await _context.SaveChangesAsync();
            response?.Cookies.Delete("accessToken");
            response?.Cookies.Delete("refreshToken");
        }
        public async Task<LogOutViewModel>LogOut(CustomError error)
        {
            var request = _httpContextAccessor.HttpContext?.Request;
            var response = _httpContextAccessor.HttpContext?.Response;
            string? oldAccessToken = request?.Cookies["accessToken"];
            string? oldRefreshToken = request?.Cookies["refreshToken"];
            if (string.IsNullOrWhiteSpace(oldAccessToken) || string.IsNullOrWhiteSpace(oldRefreshToken))
            {
                error.AddError("Token", "ไม่มี access token หรือ refresh token");
                error.ThrowIfError();
            }
            var refreshtokenDb = await _context.UserRefreshTokens
                .FirstOrDefaultAsync(x => x.AccessToken == oldAccessToken && x.RefreshToken == oldRefreshToken);
            if (refreshtokenDb != null)
            {
                refreshtokenDb.RevokedTime = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
            response?.Cookies.Delete("accessToken");
            response?.Cookies.Delete("refreshToken");
       
            return new LogOutViewModel
            {
                IsSuccess = true,
                Message = "Logout สำเร็จ"
            };
        }

        public Task SetJWTTokenService(string accessToken, string refreshToken)
        {
            var accessExpireMinutes = Convert.ToDouble(_configuration["JwtConfig:AccessTokenExpireMinutes"]);
            var refreshExpireDays = Convert.ToDouble(_configuration["JwtConfig:RefreshTokenExpireDays"]);
            var response = _httpContextAccessor.HttpContext?.Response;
            response?.Cookies.Append("accessToken", accessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddMinutes(accessExpireMinutes)
            });
            response?.Cookies.Append("refreshToken", refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddDays(refreshExpireDays)
            });
            return Task.CompletedTask;
        }
    }
}

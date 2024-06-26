using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using System;
using System.Security.Claims;
using System.Text;
using backend.Services;
using backend.Models;
using backend.Data;
using backend.DTO;
using Microsoft.AspNetCore.Http;
using TestClient;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize] // Require authorization for accessing these endpoints
    public class AccountController : ControllerBase
    {
        private readonly JWTService _jwtService;
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        private readonly EmailService _emailService;

        private readonly MailSender _mailSender;
        private readonly IConfiguration _config;
        private readonly Context _context;


        private readonly IHttpContextAccessor _httpContextAccessor;

        public AccountController(
            JWTService jwtService,
            SignInManager<User> signInManager,
            UserManager<User> userManager,
            EmailService emailService,
            IConfiguration config,
            Context context,
            IHttpContextAccessor httpContextAccessor,
            MailSender mailSender

            )
        {
            _jwtService = jwtService;
            _signInManager = signInManager;
            _userManager = userManager;
            _emailService = emailService;
            _config = config;
            _context = context;
            _mailSender = mailSender;
            _httpContextAccessor = httpContextAccessor;
        }

        [Authorize]
        [HttpGet("refresh-user-token")]
        public async Task<ActionResult<UserDto>> RefreshUserToken()
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByNameAsync(email);

            if (user != null)
            {
                return CreateApplicationUserDto(user);
            }

            var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.Email == email);
            if (doctor != null)
            {
                var userFromDoctor = new User
                {
                    Id = doctor.Id.ToString(),
                    FirstName = doctor.FirstName,
                    PrivateNumber = doctor.PrivateNumber,
                    LastName = doctor.LastName,
                    Email = doctor.Email
                    // Add any other properties if needed
                };
                return CreateApplicationUserDto(userFromDoctor);
            }

            // If neither user nor doctor is found, return unauthorized
            return Unauthorized();
        }
        private UserDto CreateApplicationUserDto(User user, string type)
        {
            return new UserDto
            {
                Id = user.Id.ToString(),
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                PrivateNumber = user.PrivateNumber,
                JWT = _jwtService.CreateJWT(user),
                Type = type,

            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<object>> Login(LoginDto model)
        {
            // Try to log in as a user
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user != null)
            {
                if (user.EmailConfirmed == false)
                {
                    return Unauthorized("Please confirm your email.");
                }

                var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
                if (result.Succeeded)
                {
                    return CreateApplicationUserDto(user, "User");
                }
            }

            // Try to log in as a doctor
            var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.Email == model.UserName && d.Password == model.Password);
            if (doctor != null)
            {
                // Assuming Doctor model inherits from User model or you have a separate User model
                var userFromDoctor = new User
                {
                    Id = doctor.Id.ToString(),
                    FirstName = doctor.FirstName,
                    PrivateNumber = doctor.PrivateNumber,
                    LastName = doctor.LastName,
                    Email = doctor.Email
                    // Add any other properties if needed
                };

                // Create JWT token for the doctor
                var jwt = _jwtService.CreateJWT(userFromDoctor);

                // Return doctor DTO with JWT token
                var loggedInDoctor = new DoctorDto
                {
                    Id = doctor.Id,
                    FirstName = doctor.FirstName,
                    LastName = doctor.LastName,
                    PrivateNumber = doctor.PrivateNumber,
                    Email = doctor.Email,
                    Category = doctor.Category,
                    JWT = jwt,
                    ImageUrl = GetImageUrl(doctor.ImageUrl),
                    CVUrl = GetImageUrl(doctor.CVUrl),
                    Type = "Doctor"
                };
                return Ok(loggedInDoctor);
            }

            // Try to log in as an admin
            var admin = await _context.Admins.FirstOrDefaultAsync(a => a.Email == model.UserName && a.Password == model.Password);
            if (admin != null)
            {
                return Ok(admin);
            }

            // If neither user, doctor, nor admin is found, return unauthorized
            return Unauthorized("Invalid username or password");
        }
        private async Task<string> SaveFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return null;
            }

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }

            var filePath = Path.Combine(directoryPath, fileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            return fileName;
        }
        [HttpGet("images/{fileName}")]
        public IActionResult GetImage(string fileName)
        {
            var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", fileName);

            if (!System.IO.File.Exists(imagePath))
            {
                return NotFound();
            }

            var imageData = System.IO.File.OpenRead(imagePath);
            return File(imageData, "image/jpeg");
        }

        private string GetImageUrl(string relativePath)
        {
            var request = _httpContextAccessor.HttpContext.Request;
            var baseUrl = $"{request.Scheme}://{request.Host.Value}";
            return $"{baseUrl}/api/Doctor/images/{relativePath}";
        }


        [HttpDelete("users")]
        // Ensure only users with the "Admin" role can access this endpoint
        public async Task<IActionResult> DeleteAllUsers()
        {
            var users = await _context.Users.ToListAsync();
            foreach (var user in users)
            {
                var result = await _userManager.DeleteAsync(user);
                if (!result.Succeeded)
                {
                    // Log or handle errors if needed
                    return BadRequest("Failed to delete users");
                }
            }
            return Ok("All users deleted successfully");
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto model)
        {
            if (await CheckEmailExistsAsync(model.Email))
            {
                return BadRequest($"An existing account is using {model.Email}, email address. Please try with another email address");
            }

            var userToAdd = new User
            {
                Id = model.Id.ToString(),
                FirstName = model.FirstName.ToLower(),
                LastName = model.LastName.ToLower(),
                UserName = model.Email.ToLower(),
                PrivateNumber = model.PrivateNumber.ToString(),
                Email = model.Email.ToLower(),
                EmailConfirmed = true,
            };

            // creates a user inside our AspNetUsers table inside our database
            var result = await _userManager.CreateAsync(userToAdd, model.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);

            return Ok(new JsonResult(new { title = "Registration successful", message = "Please check your email to verify your account" }));
        }




        [HttpPost("forgot-username-or-password/{email}")]
        public async Task<IActionResult> ForgotUsernameOrPassword(string email)
        {
            if (string.IsNullOrEmpty(email)) return BadRequest("Invalid email");

            var user = await _userManager.FindByEmailAsync(email);

            if (user == null) return Unauthorized("This email address has not been registered yet");
            if (user.EmailConfirmed == false) return BadRequest("Please confirm your email address first.");

            try
            {
                if (await SendForgotUsernameOrPasswordEmail(user))
                {
                    return Ok(new JsonResult(new { title = "Forgot username or password email sent", message = "Please check your email" }));
                }

                return BadRequest("Failed to send email. Please contact admin");
            }
            catch (Exception)
            {
                return BadRequest("Failed to send email. Please contact admin");
            }
        }

        [HttpPut("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null) return Unauthorized("This email address has not been registered yet");
            if (user.EmailConfirmed == false) return BadRequest("Please confirm your email address first");

            try
            {
                var decodedTokenBytes = WebEncoders.Base64UrlDecode(model.Token);
                var decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);

                var result = await _userManager.ResetPasswordAsync(user, decodedToken, model.NewPassword);
                if (result.Succeeded)
                {
                    return Ok(new JsonResult(new { title = "Password reset success", message = "Your password has been reset" }));
                }

                return BadRequest("Invalid token. Please try again");
            }
            catch (Exception)
            {
                return BadRequest("Invalid token. Please try again");
            }
        }

        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _context.Users.ToListAsync();
            var userDtos = users.Select(CreateApplicationUserDto).ToList();
            return Ok(userDtos);
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound("User not found");
            }
            var result = await _userManager.DeleteAsync(user);
            if (result.Succeeded)
            {
                return Ok("User deleted successfully");
            }
            else
            {
                return BadRequest("Failed to delete user");
            }
        }

        #region Private Helper Methods
        private UserDto CreateApplicationUserDto(User user)
        {
            return new UserDto
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                PrivateNumber = user.PrivateNumber,
                JWT = _jwtService.CreateJWT(user),
                Id = user.Id
            };
        }

        private async Task<bool> CheckEmailExistsAsync(string email)
        {
            return await _userManager.Users.AnyAsync(x => x.Email == email.ToLower());
        }



        private async Task<bool> SendForgotUsernameOrPasswordEmail(User user)
        {
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
            var url = $"{_config["JWT:ClientUrl"]}/{_config["Email:ResetPasswordPath"]}?token={token}&email={user.Email}";

            var body = $"<p>Hello: {user.FirstName} {user.LastName}</p>" +
               $"<p>Username: {user.UserName}.</p>" +
               "<p>In order to reset your password, please click on the following link.</p>" +
               $"<p><a href=\"{url}\">Click here</a></p>" +
               "<p>Thank you,</p>" +
               $"<br>{_config["Email:ApplicationName"]}";

            var emailSend = new EmailSendDto(user.Email, "Forgot username or password", body);

            return await _emailService.SendEmailAsync(emailSend);
        }
        #endregion
    }
}
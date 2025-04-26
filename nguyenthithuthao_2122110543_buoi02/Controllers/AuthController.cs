using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using nguyenthithuthao_2122110543_buoi02.Data;
using nguyenthithuthao_2122110543_buoi02.Model;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    // ========== ĐĂNG KÝ ==========
    [HttpPost("register")]
    public IActionResult RegisterAdmin([FromBody] RegisterRequest request)
    {
        if (_context.Users.Any(u => u.Email == request.Email))
            return BadRequest("Email đã được sử dụng");

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Phone = request.Phone,
            Address = request.Address,
            Role = request.Role,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };

        _context.Users.Add(user);
        _context.SaveChanges();

        return Ok("Đăng ký thành công");
    }


    // ========== ĐĂNG NHẬP ==========
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        var user = _context.Users.SingleOrDefault(u => u.Email == request.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            return Unauthorized("Sai thông tin đăng nhập");

        var token = GenerateJwtToken(user);
        return Ok(new { token });
    }
    [HttpGet("all")]
    [Authorize(Roles = "Admin")] // Hoặc chỉ cần [Authorize] nếu không cần phân quyền
    public IActionResult GetAllUsers()
    {
        var users = _context.Users.ToList();
        return Ok(users);
    }

    // ========== LẤY USER HIỆN TẠI ==========
    [HttpGet("me")]
    [Authorize]
    public IActionResult GetCurrentUser()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized("No UserId in claims!");

        var user = _context.Users.Find(int.Parse(userId));
        if (user == null) return NotFound();

        return Ok(user);
    }


    // ========== TẠO TOKEN ==========
    private string GenerateJwtToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]);

        var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.Name),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, user.Role)
    };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(double.Parse(_config["Jwt:ExpireMinutes"])),
            Issuer = _config["Jwt:Issuer"],
            Audience = _config["Jwt:Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
    [HttpGet("user/{id}")]
    [Authorize(Roles = "Admin")] // Hoặc chỉ cần [Authorize] nếu không cần phân quyền
    public IActionResult GetUserById(int id)
    {
        var user = _context.Users.Find(id);
        if (user == null)
            return NotFound("Không tìm thấy người dùng");

        return Ok(user);
    }
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult UpdateUser(int id, [FromBody] User updatedUser)
    {
        var user = _context.Users.Find(id);
        if (user == null)
            return NotFound("Không tìm thấy người dùng");

        user.Name = updatedUser.Name;
        user.Email = updatedUser.Email;
        user.Phone = updatedUser.Phone;
        user.Address = updatedUser.Address;
        user.Role = updatedUser.Role;
        user.UpdatedAt = DateTime.Now;

        _context.SaveChanges();
        return Ok(user);
    }

    // DELETE: api/users/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult DeleteUser(int id)
    {
        var user = _context.Users.Find(id);
        if (user == null)
            return NotFound("Không tìm thấy người dùng");

        _context.Users.Remove(user);
        _context.SaveChanges();

        return Ok("Xóa người dùng thành công");
    }

}

public class LoginRequest
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}

public class RegisterRequest
{
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string Role { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string Address { get; set; } = null!;
}

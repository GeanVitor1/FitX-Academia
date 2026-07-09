using System.Security.Claims;
using FitX.Identity.Models;
using FitX.Identity.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FitX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly UserManager<FitX.Domain.Entities.Usuario> _userManager;

    public AuthController(AuthService authService, UserManager<FitX.Domain.Entities.Usuario> userManager)
    {
        _authService = authService;
        _userManager = userManager;
    }

    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResult), 200)]
    [ProducesResponseType(typeof(AuthResult), 400)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var result = await _authService.RegisterAsync(request);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResult), 200)]
    [ProducesResponseType(typeof(AuthResult), 400)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPost("refresh")]
    [ProducesResponseType(typeof(AuthResult), 200)]
    [ProducesResponseType(typeof(AuthResult), 400)]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        var result = await _authService.RefreshTokenAsync(request);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPost("forgot-password")]
    [ProducesResponseType(typeof(AuthResult), 200)]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        var result = await _authService.ForgotPasswordAsync(request.Email);
        return Ok(result);
    }

    [HttpPost("reset-password")]
    [ProducesResponseType(typeof(AuthResult), 200)]
    [ProducesResponseType(typeof(AuthResult), 400)]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        var result = await _authService.ResetPasswordAsync(request.Email, request.Token, request.NewPassword);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpGet("quick-logins")]
    [ProducesResponseType(typeof(object), 200)]
    public async Task<IActionResult> GetQuickLogins()
    {
        var demoEmails = new[]
        {
            "admin@fitx.com",
            "prof@fitx.com",
            "aluno@fitx.com",
            "recepcao@fitx.com",
            "financeiro@fitx.com"
        };

        var users = await _userManager.Users
            .Where(u => u.Ativo && demoEmails.Contains(u.Email ?? string.Empty))
            .Select(u => new QuickLoginInfo
            {
                Email = u.Email ?? string.Empty,
                Nome = u.Nome,
                Role = u.Role.ToString(),
                Password = "1234"
            })
            .ToListAsync();

        var roleIcons = new Dictionary<string, string>
        {
            { "Admin", "\u2699\uFE0F" },
            { "Professor", "\uD83C\uDFCB\uFE0F" },
            { "Aluno", "\uD83D\uDCAA" },
            { "Recepcionista", "\uD83C\uDFE2" },
            { "Financeiro", "\uD83D\uDCB0" }
        };

        var result = users.Select(u => new
        {
            u.Email,
            u.Nome,
            u.Role,
            u.Password,
            Icon = roleIcons.GetValueOrDefault(u.Role, "\uD83D\uDC64")
        });

        return Ok(new { success = true, accounts = result });
    }

    [HttpPost("quick-login")]
    [ProducesResponseType(typeof(AuthResult), 200)]
    [ProducesResponseType(typeof(AuthResult), 400)]
    public async Task<IActionResult> QuickLogin([FromBody] QuickLoginRequest request)
    {
        var result = await _authService.QuickLoginAsync(request.Email);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

}

public class ForgotPasswordRequest
{
    public string Email { get; set; } = string.Empty;
}

public class ResetPasswordRequest
{
    public string Email { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}

public class QuickLoginInfo
{
    public string Email { get; set; } = string.Empty;
    public string Nome { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class QuickLoginRequest
{
    public string Email { get; set; } = string.Empty;
}

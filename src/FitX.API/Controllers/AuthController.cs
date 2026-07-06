using System.Security.Claims;
using FitX.Domain.Enums;
using FitX.Identity.Models;
using FitX.Identity.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

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

    [HttpPost("seed-admin")]
    public async Task<IActionResult> SeedAdmin()
    {
        var existing = await _userManager.FindByEmailAsync("admin@fitx.com");
        if (existing is not null)
        {
            existing.Role = UserRole.Admin;
            await _userManager.UpdateAsync(existing);
            return Ok(new { success = true, message = "Usuário promovido a Admin" });
        }

        var user = new FitX.Domain.Entities.Usuario
        {
            UserName = "admin@fitx.com",
            Nome = "Administrador",
            Email = "admin@fitx.com",
            Role = UserRole.Admin,
            Ativo = true,
            CriadoEm = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(user, "Admin@123");
        if (!result.Succeeded)
        {
            return BadRequest(new { success = false, errors = result.Errors.Select(e => e.Description) });
        }

        return Ok(new { success = true, message = "Admin criado com sucesso" });
    }

    [HttpPost("seed-data")]
    public async Task<IActionResult> SeedData()
    {
        var results = new List<object>();

        // Create professors
        var professors = new (string email, string nome, string password)[]
        {
            ("carlos@fitx.com", "Carlos Silva", "Prof@123"),
            ("ana.prof@fitx.com", "Ana Oliveira", "Prof@123"),
            ("pedro.prof@fitx.com", "Pedro Santos", "Prof@123")
        };

        foreach (var (email, nome, password) in professors)
        {
            var existing = await _userManager.FindByEmailAsync(email);
            if (existing is null)
            {
                var user = new FitX.Domain.Entities.Usuario
                {
                    UserName = email, Nome = nome, Email = email,
                    Role = UserRole.Professor, Ativo = true, CriadoEm = DateTime.UtcNow
                };
                await _userManager.CreateAsync(user, password);
                results.Add(new { email, status = "criado", role = "Professor" });
            }
            else
            {
                results.Add(new { email, status = "ja existe" });
            }
        }

        // Create students
        var students = new (string email, string nome, string password)[]
        {
            ("joao@email.com", "Joao Silva", "1234"),
            ("maria@email.com", "Maria Santos", "1234"),
            ("pedro@email.com", "Pedro Lima", "1234"),
            ("ana@email.com", "Ana Costa", "1234"),
            ("lucas@email.com", "Lucas Oliveira", "1234"),
            ("julia@email.com", "Julia Ferreira", "1234"),
            ("rafael@email.com", "Rafael Souza", "1234"),
            ("camila@email.com", "Camila Almeida", "1234")
        };

        foreach (var (email, nome, password) in students)
        {
            var existing = await _userManager.FindByEmailAsync(email);
            if (existing is null)
            {
                var user = new FitX.Domain.Entities.Usuario
                {
                    UserName = email, Nome = nome, Email = email,
                    Role = UserRole.Aluno, Ativo = true, CriadoEm = DateTime.UtcNow
                };
                await _userManager.CreateAsync(user, password);
                results.Add(new { email, status = "criado", role = "Aluno" });
            }
            else
            {
                results.Add(new { email, status = "ja existe" });
            }
        }

        // Create receptionist
        var recepcionista = await _userManager.FindByEmailAsync("recepcao@fitx.com");
        if (recepcionista is null)
        {
            var user = new FitX.Domain.Entities.Usuario
            {
                UserName = "recepcao@fitx.com", Nome = "Maria Recepcao", Email = "recepcao@fitx.com",
                Role = UserRole.Recepcionista, Ativo = true, CriadoEm = DateTime.UtcNow
            };
            await _userManager.CreateAsync(user, "Recep@123");
            results.Add(new { email = "recepcao@fitx.com", status = "criado", role = "Recepcionista" });
        }

        // Create financial
        var financeiro = await _userManager.FindByEmailAsync("financeiro@fitx.com");
        if (financeiro is null)
        {
            var user = new FitX.Domain.Entities.Usuario
            {
                UserName = "financeiro@fitx.com", Nome = "Pedro Financeiro", Email = "financeiro@fitx.com",
                Role = UserRole.Financeiro, Ativo = true, CriadoEm = DateTime.UtcNow
            };
            await _userManager.CreateAsync(user, "Finance@123");
            results.Add(new { email = "financeiro@fitx.com", status = "criado", role = "Financeiro" });
        }

        return Ok(new { success = true, accounts = results });
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

    [Authorize]
    [HttpPost("revoke")]
    [ProducesResponseType(typeof(AuthResult), 200)]
    [ProducesResponseType(typeof(AuthResult), 400)]
    public async Task<IActionResult> RevokeToken([FromBody] RefreshTokenRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return BadRequest(AuthResult.FailureResult("Usuário não autenticado"));
        }

        var result = await _authService.RevokeTokenAsync(userId, request.RefreshToken);

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

    [Authorize]
    [HttpGet("me")]
    [ProducesResponseType(typeof(object), 200)]
    public IActionResult GetCurrentUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var email = User.FindFirst(ClaimTypes.Email)?.Value;
        var name = User.FindFirst(ClaimTypes.Name)?.Value;
        var role = User.FindFirst(ClaimTypes.Role)?.Value;

        return Ok(new
        {
            Id = userId,
            Email = email,
            Name = name,
            Role = role
        });
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

using System.Security.Claims;
using FitX.Domain.Enums;
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

        // Create/refresh demo login users (used by quick-login buttons)
        var demoLogins = new (string email, string nome, UserRole role, string password)[]
        {
            ("admin@fitx.com",      "Admin FitX",         UserRole.Admin,         "1234"),
            ("prof@fitx.com",       "Professor FitX",     UserRole.Professor,     "1234"),
            ("aluno@fitx.com",      "Aluno FitX",         UserRole.Aluno,         "1234"),
            ("recepcao@fitx.com",   "Maria Recepcao",     UserRole.Recepcionista, "1234"),
            ("financeiro@fitx.com", "Pedro Financeiro",   UserRole.Financeiro,    "1234")
        };

        foreach (var (email, nome, role, password) in demoLogins)
        {
            var existing = await _userManager.FindByEmailAsync(email);
            if (existing is not null)
            {
                await _userManager.DeleteAsync(existing);
            }

            var user = new FitX.Domain.Entities.Usuario
            {
                UserName = email, Nome = nome, Email = email,
                Role = role, Ativo = true, CriadoEm = DateTime.UtcNow
            };
            var result = await _userManager.CreateAsync(user, password);
            if (result.Succeeded)
                results.Add(new { email, status = "criado/recriado", role = role.ToString() });
            else
                results.Add(new { email, status = "erro", errors = result.Errors.Select(e => e.Description) });
        }

        return Ok(new { success = true, accounts = results });
    }

    [HttpPost("seed-logins")]
    public async Task<IActionResult> SeedLogins()
    {
        var results = new List<object>();

        var logins = new (string email, string nome, UserRole role, string password)[]
        {
            ("admin@fitx.com",   "Admin FitX",     UserRole.Admin,         "1234"),
            ("prof@fitx.com",    "Professor FitX",  UserRole.Professor,     "1234"),
            ("aluno@fitx.com",   "Aluno FitX",      UserRole.Aluno,         "1234"),
            ("recepcao@fitx.com","Recepcionista FitX", UserRole.Recepcionista, "1234"),
            ("financeiro@fitx.com","Financeiro FitX", UserRole.Financeiro,  "1234")
        };

        foreach (var (email, nome, role, password) in logins)
        {
            var existing = await _userManager.FindByEmailAsync(email);
            if (existing is not null)
            {
                var deleted = await _userManager.DeleteAsync(existing);
                if (!deleted.Succeeded)
                {
                    results.Add(new { email, status = "erro ao deletar", errors = deleted.Errors.Select(e => e.Description) });
                    continue;
                }
            }

            var user = new FitX.Domain.Entities.Usuario
            {
                UserName = email, Nome = nome, Email = email,
                Role = role, Ativo = true, CriadoEm = DateTime.UtcNow
            };
            var result = await _userManager.CreateAsync(user, password);
            if (result.Succeeded)
                results.Add(new { email, role = role.ToString(), password, status = "criado" });
            else
                results.Add(new { email, role = role.ToString(), status = "erro", errors = result.Errors.Select(e => e.Description) });
        }

        return Ok(new { success = true, accounts = results });
    }

    [HttpPost("seed-reset")]
    public async Task<IActionResult> SeedReset()
    {
        var results = new List<object>();

        var allUsers = await _userManager.Users.ToListAsync();
        foreach (var u in allUsers)
        {
            var deleted = await _userManager.DeleteAsync(u);
            if (!deleted.Succeeded)
                results.Add(new { email = u.Email, status = "erro ao deletar" });
        }

        var logins = new (string email, string nome, UserRole role, string password)[]
        {
            ("admin@fitx.com",      "Admin FitX",        UserRole.Admin,         "1234"),
            ("prof@fitx.com",       "Professor FitX",     UserRole.Professor,     "1234"),
            ("aluno@fitx.com",      "Aluno FitX",         UserRole.Aluno,         "1234"),
            ("recepcao@fitx.com",   "Recepcionista FitX", UserRole.Recepcionista, "1234"),
            ("financeiro@fitx.com", "Financeiro FitX",    UserRole.Financeiro,    "1234")
        };

        foreach (var (email, nome, role, password) in logins)
        {
            var user = new FitX.Domain.Entities.Usuario
            {
                UserName = email,
                Nome = nome,
                Email = email,
                Role = role,
                Ativo = true,
                CriadoEm = DateTime.UtcNow
            };
            var result = await _userManager.CreateAsync(user, password);
            if (result.Succeeded)
                results.Add(new { email, role = role.ToString(), password, status = "criado" });
            else
                results.Add(new { email, role = role.ToString(), status = "erro", errors = result.Errors.Select(e => e.Description) });
        }

        return Ok(new { success = true, accounts = results, message = "Banco resetado com sucesso" });
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

    [HttpGet("quick-logins")]
    [ProducesResponseType(typeof(object), 200)]
    public async Task<IActionResult> GetQuickLogins()
    {
        var users = await _userManager.Users
            .Where(u => u.Ativo)
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

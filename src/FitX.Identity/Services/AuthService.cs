using System.Security.Claims;
using FitX.Domain.Entities;
using FitX.Domain.Enums;
using FitX.Domain.Interfaces;
using FitX.Identity.Models;
using Microsoft.AspNetCore.Identity;

namespace FitX.Identity.Services;

public class AuthService
{
    private readonly UserManager<Usuario> _userManager;
    private readonly SignInManager<Usuario> _signInManager;
    private readonly TokenService _tokenService;
    private readonly IRepository<RefreshToken> _refreshTokenRepository;
    private readonly IUnitOfWork _unitOfWork;

    public AuthService(
        UserManager<Usuario> userManager,
        SignInManager<Usuario> signInManager,
        TokenService tokenService,
        IRepository<RefreshToken> refreshTokenRepository,
        IUnitOfWork unitOfWork)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
        _refreshTokenRepository = refreshTokenRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<AuthResult> RegisterAsync(RegisterRequest request, string? role = null)
    {
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser is not null)
        {
            return AuthResult.FailureResult("Email já está em uso");
        }

        var user = new Usuario
        {
            UserName = request.Email,
            Nome = request.Nome,
            Email = request.Email,
            Role = string.IsNullOrEmpty(role) ? UserRole.Aluno : Enum.Parse<UserRole>(role),
            Ativo = true,
            CriadoEm = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            return AuthResult.FailureResult(result.Errors.Select(e => e.Description));
        }

        var token = _tokenService.GenerateAccessToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken();
        var expiration = _tokenService.GetTokenExpiration();
        var refreshExpiration = _tokenService.GetRefreshTokenExpiration();

        var refreshTokenEntity = new RefreshToken
        {
            UsuarioId = user.Id,
            Token = refreshToken,
            ExpiraEm = refreshExpiration,
            Ativo = true,
            CriadoEm = DateTime.UtcNow
        };

        await _refreshTokenRepository.AddAsync(refreshTokenEntity);
        await _unitOfWork.SaveChangesAsync();

        return AuthResult.SuccessResult(token, refreshToken, expiration, refreshExpiration);
    }

    public async Task<AuthResult> LoginAsync(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user is null)
        {
            return AuthResult.FailureResult("Email ou senha inválidos");
        }

        if (!user.Ativo)
        {
            return AuthResult.FailureResult("Conta desativada");
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

        if (!result.Succeeded)
        {
            return AuthResult.FailureResult("Email ou senha inválidos");
        }

        user.UltimoLogin = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        var token = _tokenService.GenerateAccessToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken();
        var expiration = _tokenService.GetTokenExpiration();
        var refreshExpiration = _tokenService.GetRefreshTokenExpiration();

        var refreshTokenEntity = new RefreshToken
        {
            UsuarioId = user.Id,
            Token = refreshToken,
            ExpiraEm = refreshExpiration,
            Ativo = true,
            CriadoEm = DateTime.UtcNow
        };

        await _refreshTokenRepository.AddAsync(refreshTokenEntity);
        await _unitOfWork.SaveChangesAsync();

        return AuthResult.SuccessResult(token, refreshToken, expiration, refreshExpiration);
    }

    public async Task<AuthResult> RefreshTokenAsync(RefreshTokenRequest request)
    {
        var principal = _tokenService.GetPrincipalFromExpiredToken(request.Token);
        if (principal is null)
        {
            return AuthResult.FailureResult("Token inválido");
        }

        var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return AuthResult.FailureResult("Token inválido");
        }

        var refreshToken = await _refreshTokenRepository.FirstOrDefaultAsync(rt =>
            rt.Token == request.RefreshToken &&
            rt.UsuarioId == Guid.Parse(userId) &&
            rt.Ativo);

        if (refreshToken is null)
        {
            return AuthResult.FailureResult("Refresh token inválido");
        }

        if (refreshToken.Expirado)
        {
            return AuthResult.FailureResult("Refresh token expirado");
        }

        if (refreshToken.Revogado)
        {
            return AuthResult.FailureResult("Refresh token revogado");
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user is null || !user.Ativo)
        {
            return AuthResult.FailureResult("Usuário não encontrado ou desativado");
        }

        var newToken = _tokenService.GenerateAccessToken(user);
        var newRefreshToken = _tokenService.GenerateRefreshToken();
        var expiration = _tokenService.GetTokenExpiration();
        var refreshExpiration = _tokenService.GetRefreshTokenExpiration();

        refreshToken.RevogadoEm = DateTime.UtcNow;
        refreshToken.Ativo = false;
        _refreshTokenRepository.Update(refreshToken);

        var newRefreshTokenEntity = new RefreshToken
        {
            UsuarioId = user.Id,
            Token = newRefreshToken,
            ExpiraEm = refreshExpiration,
            Ativo = true,
            CriadoEm = DateTime.UtcNow
        };

        await _refreshTokenRepository.AddAsync(newRefreshTokenEntity);
        await _unitOfWork.SaveChangesAsync();

        return AuthResult.SuccessResult(newToken, newRefreshToken, expiration, refreshExpiration);
    }

    public async Task<AuthResult> RevokeTokenAsync(string userId, string refreshToken)
    {
        var token = await _refreshTokenRepository.FirstOrDefaultAsync(rt =>
            rt.Token == refreshToken &&
            rt.UsuarioId == Guid.Parse(userId) &&
            rt.Ativo);

        if (token is null)
        {
            return AuthResult.FailureResult("Refresh token não encontrado");
        }

        token.RevogadoEm = DateTime.UtcNow;
        token.Ativo = false;
        _refreshTokenRepository.Update(token);
        await _unitOfWork.SaveChangesAsync();

        return AuthResult.SuccessResult(string.Empty, string.Empty, DateTime.MinValue, DateTime.MinValue);
    }

    public async Task<AuthResult> ForgotPasswordAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user is null)
        {
            return AuthResult.SuccessResult(string.Empty, string.Empty, DateTime.MinValue, DateTime.MinValue);
        }

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        return AuthResult.SuccessResult(token, string.Empty, DateTime.MinValue, DateTime.MinValue);
    }

    public async Task<AuthResult> ResetPasswordAsync(string email, string token, string newPassword)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user is null)
        {
            return AuthResult.FailureResult("Usuário não encontrado");
        }

        var result = await _userManager.ResetPasswordAsync(user, token, newPassword);

        if (!result.Succeeded)
        {
            return AuthResult.FailureResult(result.Errors.Select(e => e.Description));
        }

        return AuthResult.SuccessResult(string.Empty, string.Empty, DateTime.MinValue, DateTime.MinValue);
    }
}

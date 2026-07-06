namespace FitX.Identity.Models;

public class AuthResult
{
    public bool Success { get; set; }
    public string? Token { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime? Expiration { get; set; }
    public DateTime? RefreshExpiration { get; set; }
    public string? Error { get; set; }
    public IEnumerable<string>? Errors { get; set; }

    public static AuthResult SuccessResult(string token, string refreshToken, DateTime expiration, DateTime refreshExpiration)
    {
        return new AuthResult
        {
            Success = true,
            Token = token,
            RefreshToken = refreshToken,
            Expiration = expiration,
            RefreshExpiration = refreshExpiration
        };
    }

    public static AuthResult FailureResult(string error)
    {
        return new AuthResult
        {
            Success = false,
            Error = error
        };
    }

    public static AuthResult FailureResult(IEnumerable<string> errors)
    {
        return new AuthResult
        {
            Success = false,
            Errors = errors
        };
    }
}

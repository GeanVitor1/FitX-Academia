using System.Diagnostics;

namespace FitX.API.Middlewares;

public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();
        var requestId = Guid.NewGuid().ToString();

        context.Request.Headers["X-Request-Id"] = requestId;

        _logger.LogInformation("[{RequestId}] {Method} {Path}",
            requestId, context.Request.Method, context.Request.Path);

        try
        {
            await _next(context);
        }
        finally
        {
            stopwatch.Stop();
            var statusCode = context.Response.StatusCode;
            var level = statusCode >= 400 ? LogLevel.Warning : LogLevel.Information;

            _logger.Log(level, "[{RequestId}] {Method} {Path} → {StatusCode} ({ElapsedMs}ms)",
                requestId, context.Request.Method, context.Request.Path, statusCode, stopwatch.ElapsedMilliseconds);
        }
    }
}

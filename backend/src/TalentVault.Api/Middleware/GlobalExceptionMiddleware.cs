using System.Text.Json;
using FluentValidation;

namespace TalentVault.Api.Middleware;

public class GlobalExceptionMiddleware
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            await HandleExceptionAsync(context, exception);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, errors, shouldLogAsError) = exception switch
        {
            ValidationException validationException =>
            (
                StatusCodes.Status400BadRequest,
                validationException.Errors.Select(error => error.ErrorMessage).Distinct().ToArray(),
                false
            ),
            InvalidOperationException invalidOperationException =>
            (
                StatusCodes.Status400BadRequest,
                new[] { invalidOperationException.Message },
                false
            ),
            UnauthorizedAccessException unauthorizedAccessException =>
            (
                StatusCodes.Status401Unauthorized,
                new[] { unauthorizedAccessException.Message },
                false
            ),
            KeyNotFoundException keyNotFoundException =>
            (
                StatusCodes.Status404NotFound,
                new[] { keyNotFoundException.Message },
                false
            ),
            _ =>
            (
                StatusCodes.Status500InternalServerError,
                new[] { "Erro interno do servidor" },
                true
            )
        };

        if (shouldLogAsError)
        {
            _logger.LogError(exception, "Unhandled exception while processing {Method} {Path}", context.Request.Method, context.Request.Path);
        }
        else
        {
            _logger.LogWarning(exception, "Handled exception while processing {Method} {Path}", context.Request.Method, context.Request.Path);
        }

        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";

        var payload = new
        {
            success = false,
            errors
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(payload, JsonOptions));
    }
}
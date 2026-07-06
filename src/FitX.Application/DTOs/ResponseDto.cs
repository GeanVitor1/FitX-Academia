namespace FitX.Application.DTOs;

public class ResponseDto<T>
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public T? Data { get; set; }
    public IEnumerable<string>? Errors { get; set; }

    public static ResponseDto<T> SuccessResult(T data, string? message = null)
    {
        return new ResponseDto<T>
        {
            Success = true,
            Data = data,
            Message = message
        };
    }

    public static ResponseDto<T> FailureResult(string error)
    {
        return new ResponseDto<T>
        {
            Success = false,
            Errors = new[] { error }
        };
    }

    public static ResponseDto<T> FailureResult(IEnumerable<string> errors)
    {
        return new ResponseDto<T>
        {
            Success = false,
            Errors = errors
        };
    }
}

public class PagedResultDto<T>
{
    public IEnumerable<T> Items { get; set; } = new List<T>();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    public bool HasPrevious => PageNumber > 1;
    public bool HasNext => PageNumber < TotalPages;
}

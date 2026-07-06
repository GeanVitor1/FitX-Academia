namespace FitX.Infrastructure.Interfaces;

public interface IStorageService
{
    Task<string> UploadAsync(Stream fileStream, string fileName, string contentType);
    Task DeleteAsync(string fileUrl);
    Task<string> GetFileUrlAsync(string fileName);
}

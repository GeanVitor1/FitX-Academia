using FitX.Infrastructure.Interfaces;
using Minio;
using Minio.DataModel.Args;

namespace FitX.Infrastructure.Services;

public class MinioStorageService : IStorageService
{
    private readonly IMinioClient _minioClient;
    private readonly string _bucketName;

    public MinioStorageService(IMinioClient minioClient, string bucketName = "fitx-uploads")
    {
        _minioClient = minioClient;
        _bucketName = bucketName;
    }

    public async Task<string> UploadAsync(Stream fileStream, string fileName, string contentType)
    {
        var exists = await _minioClient.BucketExistsAsync(new BucketExistsArgs().WithBucket(_bucketName));
        if (!exists)
            await _minioClient.MakeBucketAsync(new MakeBucketArgs().WithBucket(_bucketName));

        var objectName = $"{DateTime.UtcNow:yyyy/MM/dd}/{Guid.NewGuid()}_{fileName}";

        await _minioClient.PutObjectAsync(new PutObjectArgs()
            .WithBucket(_bucketName)
            .WithObject(objectName)
            .WithStreamData(fileStream)
            .WithObjectSize(fileStream.Length)
            .WithContentType(contentType));

        return $"{_bucketName}/{objectName}";
    }

    public async Task DeleteAsync(string fileUrl)
    {
        var objectName = fileUrl.Replace($"{_bucketName}/", "");
        await _minioClient.RemoveObjectAsync(new RemoveObjectArgs()
            .WithBucket(_bucketName)
            .WithObject(objectName));
    }

    public Task<string> GetFileUrlAsync(string fileName)
    {
        return Task.FromResult($"{_bucketName}/{fileName}");
    }
}

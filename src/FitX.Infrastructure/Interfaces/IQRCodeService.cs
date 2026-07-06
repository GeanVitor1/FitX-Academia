namespace FitX.Infrastructure.Interfaces;

public interface IQRCodeService
{
    byte[] Generate(string data);
    string GenerateBase64(string data);
}

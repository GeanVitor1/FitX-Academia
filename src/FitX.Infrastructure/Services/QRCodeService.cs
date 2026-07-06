using FitX.Infrastructure.Interfaces;
using QRCoder;

namespace FitX.Infrastructure.Services;

public class QRCodeService : IQRCodeService
{
    public byte[] Generate(string data)
    {
        using var qrGenerator = new QRCodeGenerator();
        var qrCodeData = qrGenerator.CreateQrCode(data, QRCodeGenerator.ECCLevel.Q);
        var qrCode = new PngByteQRCode(qrCodeData);
        return qrCode.GetGraphic(20);
    }

    public string GenerateBase64(string data)
    {
        var bytes = Generate(data);
        return $"data:image/png;base64,{Convert.ToBase64String(bytes)}";
    }
}

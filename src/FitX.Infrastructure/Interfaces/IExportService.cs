namespace FitX.Infrastructure.Interfaces;

public interface IExportService
{
    byte[] ExportPdf<T>(IEnumerable<T> data, string title, Dictionary<string, Func<T, object>> columns);
    byte[] ExportExcel<T>(IEnumerable<T> data, string sheetName, Dictionary<string, Func<T, object>> columns);
}

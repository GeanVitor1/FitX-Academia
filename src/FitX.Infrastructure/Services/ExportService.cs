using System.Globalization;
using ClosedXML.Excel;
using FitX.Infrastructure.Interfaces;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace FitX.Infrastructure.Services;

public class ExportService : IExportService
{
    public ExportService()
    {
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public byte[] ExportPdf<T>(IEnumerable<T> data, string title, Dictionary<string, Func<T, object>> columns)
    {
        var items = data.ToList();

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(30);

                page.Header().Text(title).FontSize(20).Bold().AlignCenter();

                page.Content().Table(table =>
                {
                    table.ColumnsDefinition(columnsDef =>
                    {
                        foreach (var _ in columns)
                            columnsDef.RelativeColumn();
                    });

                    table.Header(header =>
                    {
                        foreach (var col in columns)
                            header.Cell().Text(col.Key).Bold().FontSize(10);
                    });

                    foreach (var item in items)
                    {
                        foreach (var col in columns)
                        {
                            var value = col.Value(item);
                            table.Cell().Text(value?.ToString() ?? "").FontSize(9);
                        }
                    }
                });

                page.Footer()
                    .AlignCenter()
                    .Text(text =>
                    {
                        text.Span("Página ");
                        text.CurrentPageNumber();
                    });
            });
        });

        using var stream = new MemoryStream();
        document.GeneratePdf(stream);
        return stream.ToArray();
    }

    public byte[] ExportExcel<T>(IEnumerable<T> data, string sheetName, Dictionary<string, Func<T, object>> columns)
    {
        var items = data.ToList();

        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add(sheetName);

        var colIndex = 1;
        foreach (var col in columns)
        {
            worksheet.Cell(1, colIndex).Value = col.Key;
            worksheet.Cell(1, colIndex).Style.Font.Bold = true;
            colIndex++;
        }

        var rowIndex = 2;
        foreach (var item in items)
        {
            colIndex = 1;
            foreach (var col in columns)
            {
                var value = col.Value(item);
                worksheet.Cell(rowIndex, colIndex).Value = value?.ToString() ?? "";
                colIndex++;
            }
            rowIndex++;
        }

        worksheet.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();
    }
}

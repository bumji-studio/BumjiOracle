using System;
using System.IO;
using System.Threading.Tasks;
using Windows.Data.Pdf;
using Windows.Storage;
using Windows.Storage.Streams;

class Program
{
    static void Main(string[] args)
    {
        try
        {
            Run().GetAwaiter().GetResult();
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error: " + ex.Message);
            Console.WriteLine(ex.StackTrace);
        }
    }

    static async Task Run()
    {
        string currentDir = Directory.GetCurrentDirectory();
        string pdfPath = Path.Combine(currentDir, "JiuTian-Book.pdf");
        Console.WriteLine("Loading: " + pdfPath);

        if (!File.Exists(pdfPath))
        {
            Console.WriteLine("File not found!");
            return;
        }

        var file = await StorageFile.GetFileFromPathAsync(pdfPath);
        var pdfDoc = await PdfDocument.LoadFromFileAsync(file);

        Console.WriteLine("Successfully loaded PDF!");
        Console.WriteLine("Total Pages: " + pdfDoc.PageCount);

        int maxPages = Math.Min(3, (int)pdfDoc.PageCount);
        for (uint i = 0; i < maxPages; i++)
        {
            using (var page = pdfDoc.GetPage(i))
            {
                var stream = new InMemoryRandomAccessStream();
                await page.RenderToStreamAsync(stream);

                string outPng = Path.Combine(currentDir, "page_" + (i + 1) + ".png");
                using (var fileStream = File.Create(outPng))
                {
                    using (var netStream = System.IO.WindowsRuntimeStreamExtensions.AsStreamForRead(stream))
                    {
                        netStream.CopyTo(fileStream);
                    }
                }
                Console.WriteLine("Generated preview: " + outPng);
            }
        }
    }
}

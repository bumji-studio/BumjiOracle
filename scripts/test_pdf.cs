using System;
using System.IO;
using System.Reflection;

class Program {
    static void Main(string[] args) {
        string searchPattern = "*v4*.pdf";
        string[] files = Directory.GetFiles(".", searchPattern);
        if (files.Length == 0) files = Directory.GetFiles(".", "*.pdf");
        
        if (files.Length == 0) {
            Console.WriteLine("No PDF found.");
            return;
        }

        string pdfPath = Path.GetFullPath(files[0]);
        Console.WriteLine("Found PDF: " + pdfPath);

        try {
            var fileType = Type.GetType("Windows.Storage.StorageFile, Windows.Storage, ContentType=WindowsRuntime");
            var pdfDocType = Type.GetType("Windows.Data.Pdf.PdfDocument, Windows.Data.Pdf, ContentType=WindowsRuntime");
            
            var getFileTask = fileType.GetMethod("GetFileFromPathAsync", new Type[] { typeof(string) }).Invoke(null, new object[] { pdfPath });
            var getFileResultMethod = getFileTask.GetType().GetMethod("GetResults");
            while (getFileTask.GetType().GetProperty("Status").GetValue(getFileTask).ToString() == "Started") {
                System.Threading.Thread.Sleep(50);
            }
            var fileObj = getFileResultMethod.Invoke(getFileTask, null);

            var loadDocTask = pdfDocType.GetMethod("LoadFromFileAsync", new Type[] { fileObj.GetType() }).Invoke(null, new object[] { fileObj });
            while (loadDocTask.GetType().GetProperty("Status").GetValue(loadDocTask).ToString() == "Started") {
                System.Threading.Thread.Sleep(50);
            }
            var docObj = loadDocTask.GetType().GetMethod("GetResults").Invoke(loadDocTask, null);

            uint pageCount = (uint)pdfDocType.GetProperty("PageCount").GetValue(docObj);
            Console.WriteLine("SUCCESS_TOTAL_PAGES: " + pageCount);
        }
        catch (Exception ex) {
            Console.WriteLine("Error: " + ex.Message);
            if (ex.InnerException != null) Console.WriteLine("Inner: " + ex.InnerException.Message);
        }
    }
}

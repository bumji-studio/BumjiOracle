# inspect_pdf.ps1
# Load WinRT assemblies
[void][Windows.Data.Pdf.PdfDocument, Windows.Data.Pdf, ContentType=WindowsRuntime]
[void][Windows.Storage.StorageFile, Windows.Storage, ContentType=WindowsRuntime]
[void][Windows.Storage.Streams.InMemoryRandomAccessStream, Windows.Storage.Streams, ContentType=WindowsRuntime]
Add-Type -AssemblyName System.Runtime.WindowsRuntime

function Await-AsyncOperation($asyncOp) {
    $awaiter = [System.WindowsRuntimeSystemExtensions]::GetAwaiter($asyncOp)
    return $awaiter.GetResult()
}

$pdfFileObj = Get-Item ".\*v4*.pdf" -ErrorAction SilentlyContinue
if (-not $pdfFileObj) {
    $pdfFileObj = Get-Item ".\*.pdf" | Select-Object -First 1
}
$pdfFile = $pdfFileObj.FullName
Write-Host "Loading PDF from: $pdfFile"

$storageFileOp = [Windows.Storage.StorageFile]::GetFileFromPathAsync($pdfFile)
$file = Await-AsyncOperation $storageFileOp

$pdfDocOp = [Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($file)
$pdfDoc = Await-AsyncOperation $pdfDocOp

Write-Host "Successfully loaded PDF!"
Write-Host "Total Pages: $($pdfDoc.PageCount)"

$maxPages = [Math]::Min(5, $pdfDoc.PageCount)
for ($i = 0; $i -lt $maxPages; $i++) {
    $page = $pdfDoc.GetPage($i)
    $stream = New-Object Windows.Storage.Streams.InMemoryRandomAccessStream
    $renderOp = $page.RenderToStreamAsync($stream)
    Await-AsyncOperation $renderOp | Out-Null
    
    $outPng = Join-Path (Get-Location) "page_$($i + 1).png"
    $fileStream = [System.IO.File]::Create($outPng)
    $netStream = [System.IO.WindowsRuntimeStreamExtensions]::AsStreamForRead($stream)
    $netStream.CopyTo($fileStream)
    
    $fileStream.Close()
    $netStream.Close()
    $stream.Close()
    
    Write-Host "Generated page preview: page_$($i + 1).png"
}

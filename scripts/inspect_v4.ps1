Add-Type -AssemblyName System.Runtime.WindowsRuntime

$pdfFileObj = Get-Item ".\*v4*.pdf" | Select-Object -First 1
$pdfPath = $pdfFileObj.FullName
Write-Host "PDF Path: $pdfPath"

[void][Windows.Data.Pdf.PdfDocument, Windows.Data.Pdf, ContentType=WindowsRuntime]
[void][Windows.Storage.StorageFile, Windows.Storage, ContentType=WindowsRuntime]

# Find AsTask generic method
$asTaskMethod = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { 
    $_.Name -eq 'AsTask' -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 
} | Select-Object -First 1

function Await-WinRT($winRtAsyncOp) {
    global:asTaskMethod
    $interface = $winRtAsyncOp.GetType().GetInterfaces() | Where-Object { $_.Name -like 'IAsyncOperation*' } | Select-Object -First 1
    $genericArg = $interface.GetGenericArguments()[0]
    $closedMethod = $global:asTaskMethod.MakeGenericMethod($genericArg)
    $task = $closedMethod.Invoke($null, @($winRtAsyncOp))
    $task.Wait()
    return $task.Result
}

$fileOp = [Windows.Storage.StorageFile]::GetFileFromPathAsync($pdfPath)
$file = Await-WinRT $fileOp

$docOp = [Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($file)
$doc = Await-WinRT $docOp

Write-Host "=========================================="
Write-Host "SUCCESS! Total Pages in PDF: $($doc.PageCount)"
Write-Host "=========================================="

# Render first 5 pages to pdf_previews folder
$outDir = Join-Path (Get-Location) "pdf_previews"
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

$maxPages = [Math]::Min(10, $doc.PageCount)
for ($i = 0; $i -lt $maxPages; $i++) {
    $page = $doc.GetPage($i)
    $stream = New-Object Windows.Storage.Streams.InMemoryRandomAccessStream
    $renderOp = $page.RenderToStreamAsync($stream)
    
    # Render async operation doesn't return result, handle IAsyncAction
    $actionInterface = $renderOp.GetType().GetInterfaces() | Where-Object { $_.Name -eq 'IAsyncAction' }
    $asTaskAction = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { 
        $_.Name -eq 'AsTask' -and (-not $_.IsGenericMethod) -and $_.GetParameters().Count -eq 1 
    } | Select-Object -First 1
    
    $actionTask = $asTaskAction.Invoke($null, @($renderOp))
    $actionTask.Wait()

    $outPng = Join-Path $outDir "page_$($i + 1).png"
    $fileStream = [System.IO.File]::Create($outPng)
    $netStream = [System.IO.WindowsRuntimeStreamExtensions]::AsStreamForRead($stream)
    $netStream.CopyTo($fileStream)

    $fileStream.Close()
    $netStream.Close()
    $stream.Close()
    $page.Dispose()

    Write-Host "Saved page preview: page_$($i + 1).png"
}

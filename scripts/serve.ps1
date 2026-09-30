# serve.ps1
# A lightweight PowerShell static web server using native .NET HttpListener.
# Hosts the current directory on http://127.0.0.1:8080/

$port = 8085
$root = Resolve-Path "."
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:$port/")

Write-Host "Starting static web server..."
Write-Host "Root directory: $root"

try {
    $listener.Start()
    Write-Host "[SUCCESS] Static server running at: http://127.0.0.1:$port/"
    Write-Host "Press Ctrl+C to stop the server."
    
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq "/") {
            $urlPath = "/index.html"
        }
        
        # Build local file path
        $filePath = Join-Path $root $urlPath
        
        if (Test-Path $filePath -PathType Leaf) {
            try {
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentLength64 = $bytes.Length
                
                # Determine Content-Type
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $mime = switch($ext) {
                    ".html" { "text/html; charset=utf-8" }
                    ".css"  { "text/css; charset=utf-8" }
                    ".js"   { "application/javascript; charset=utf-8" }
                    ".pdf"  { "application/pdf" }
                    ".png"  { "image/png" }
                    ".jpg"  { "image/jpeg" }
                    ".jpeg" { "image/jpeg" }
                    default { "application/octet-stream" }
                }
                
                $response.ContentType = $mime
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } catch {
                $response.StatusCode = 500
                Write-Host "[ERROR] 500 serving $urlPath : $_"
            }
        } else {
            $response.StatusCode = 404
            Write-Host "[WARNING] 404 Not Found: $urlPath"
        }
        
        $response.Close()
    }
} catch {
    Write-Host "[ERROR] Server error: $_"
} finally {
    $listener.Stop()
    Write-Host "Server stopped."
}

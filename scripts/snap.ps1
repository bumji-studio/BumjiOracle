$tempFile = [System.IO.Path]::Combine($env:TEMP, "bazi_screen.png")
$destFile = "C:\Users\PavichayaMonsiriruan\.gemini\antigravity-ide\brain\39ee367b-76b9-47e3-95c3-969e8a740e78\bazi_view_chrome.png"

$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$args = @(
  "--headless=new",
  "--disable-gpu",
  "--no-sandbox",
  "--window-size=1520,1300",
  "--screenshot=$tempFile",
  "http://127.0.0.1:8085/?tab=bazi"
)

& $chrome $args
Start-Sleep -Seconds 2

if (Test-Path $tempFile) {
  Copy-Item $tempFile $destFile -Force
  Write-Host "SUCCESS: Saved to $destFile"
} else {
  Write-Host "FAILED: Temp file not found"
}

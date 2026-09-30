$desktop = [Environment]::GetFolderPath("Desktop")
$wscript = New-Object -ComObject WScript.Shell
$shortcutPath = Join-Path $desktop "Destiny Arcana - ดูดวงไพ่ออนไลน์.lnk"

$shortcut = $wscript.CreateShortcut($shortcutPath)
$shortcut.TargetPath = "c:\BumjiJob\JiuTianArcana\index.html"
$shortcut.WorkingDirectory = "c:\BumjiJob\JiuTianArcana"
$shortcut.Description = "Destiny Arcana - ระบบดูดวงด้วยไพ่"
$shortcut.Save()

if (Test-Path $shortcutPath) {
    Write-Host "[SUCCESS] Shortcut created successfully at: $shortcutPath"
} else {
    Write-Host "[ERROR] Could not create shortcut."
}

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Get true Desktop path dynamically from PowerShell
const desktopDir = execSync('powershell -NoProfile -Command "[Environment]::GetFolderPath(\'Desktop\')"', { encoding: 'utf8' }).trim();
console.log('Real Desktop path:', desktopDir);

if (!fs.existsSync(desktopDir)) {
  console.error('Desktop directory does not exist:', desktopDir);
  process.exit(1);
}

// 1. Create .url Internet Shortcut
const urlShortcutPath = path.join(desktopDir, 'Destiny Arcana - ดูดวงไพ่ออนไลน์.url');
const urlContent = `[InternetShortcut]
URL=file:///C:/BumjiJob/JiuTianArcana/index.html
IconIndex=237
IconFile=%SystemRoot%\\System32\\shell32.dll
`;

fs.writeFileSync(urlShortcutPath, urlContent, 'utf8');
console.log('[SUCCESS] Created URL shortcut at:', urlShortcutPath);

// 2. Create .lnk Windows Shortcut via WScript.Shell
try {
  const lnkPath = path.join(desktopDir, 'Destiny Arcana - ดูดวงไพ่ออนไลน์.lnk');
  const psScript = `
    $wscript = New-Object -ComObject WScript.Shell
    $shortcut = $wscript.CreateShortcut("${lnkPath.replace(/\\/g, '\\\\')}")
    $shortcut.TargetPath = "c:\\\\BumjiJob\\\\JiuTianArcana\\\\index.html"
    $shortcut.WorkingDirectory = "c:\\\\BumjiJob\\\\JiuTianArcana"
    $shortcut.Description = "Destiny Arcana Tarot"
    $shortcut.Save()
  `;
  const base64 = Buffer.from(psScript, 'utf16le').toString('base64');
  execSync(`powershell -NoProfile -EncodedCommand ${base64}`);
  console.log('[SUCCESS] Created LNK shortcut at:', lnkPath);
} catch (err) {
  console.log('LNK note:', err.message);
}

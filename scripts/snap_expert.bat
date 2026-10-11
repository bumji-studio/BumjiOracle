@echo off
"C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu --no-sandbox --virtual-time-budget=8000 --window-size=1520,7200 --screenshot="%TEMP%\bazi_expert_scr.png" "http://127.0.0.1:8085/?tab=bazi&mode=expert&nocache=20261011_bazi_v17"
copy /Y "%TEMP%\bazi_expert_scr.png" "C:\Users\PavichayaMonsiriruan\.gemini\antigravity-ide\brain\39ee367b-76b9-47e3-95c3-969e8a740e78\bazi_expert_view.png"

@echo off
"C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu --no-sandbox --virtual-time-budget=8000 --window-size=1520,1200 --screenshot="%TEMP%\qimen_test_view.png" "http://127.0.0.1:8085/?tab=qimen&nocache=20261011_qimen_v3"
copy /Y "%TEMP%\qimen_test_view.png" "C:\Users\PavichayaMonsiriruan\.gemini\antigravity-ide\brain\39ee367b-76b9-47e3-95c3-969e8a740e78\qimen_test_view.png"

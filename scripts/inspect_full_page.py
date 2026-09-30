import pypdf
import sys

sys.stdout.reconfigure(encoding='utf-8')

reader = pypdf.PdfReader(r"c:\BumjiJob\JiuTianArcana\คู่มือไพ่เทพจีน v4.pdf")

for page_idx in range(4, 7):
    print(f"==================== PAGE {page_idx + 1} ====================")
    text = reader.pages[page_idx].extract_text()
    print(text)

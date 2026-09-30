import pypdf
import sys

sys.stdout.reconfigure(encoding='utf-8')

reader = pypdf.PdfReader(r"c:\BumjiJob\JiuTianArcana\คู่มือไพ่เทพจีน v4.pdf")
print(f"Total pypdf pages: {len(reader.pages)}")

for i in range(4, 9):
    text = reader.pages[i].extract_text()
    print(f"=== PYPDF PAGE {i+1} ===")
    print(text[:500])

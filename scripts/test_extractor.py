import fitz # PyMuPDF
import json
import re

pdf_path = r"c:\BumjiJob\JiuTianArcana\คู่มือไพ่เทพจีน v4.pdf"
doc = fitz.open(pdf_path)

print(f"Total pages: {len(doc)}")

for page_num in range(4, 15):
    text = doc[page_num].get_text()
    print(f"--- PAGE {page_num + 1} ---")
    print(text[:400])

import pdfplumber
import re
from docx import Document
import docx2txt

def extract_text_from_pdf(pdf_path: str) -> str:
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text.strip()

def extract_text_from_docx(docx_path: str) -> str:
    doc = Document(docx_path)
    return " ".join([para.text for para in doc.paragraphs]).strip()

def extract_text_from_doc(doc_path: str) -> str:
    return docx2txt.process(doc_path).strip()

def extract_text(file_path: str) -> str:
    if file_path.endswith(".pdf"):
        return extract_text_from_pdf(file_path)
    elif file_path.endswith(".docx"):
        return extract_text_from_docx(file_path)
    elif file_path.endswith(".doc"):
        return extract_text_from_doc(file_path)
    else:
        return ""

def clean_text(text: str) -> str:
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^\w\s\-\.\,\+\#]', ' ', text)
    return text.strip()

def format_cv(text: str) -> str:
    sections = [
        "EXPERIENCE", "FORMATION", "COMPETENCES","COMPÉTENCES", "LANGUES",
        "PROJETS", "EDUCATION", "PROFIL", "CERTIFICATIONS",
        "SKILLS", "LANGUAGES", "PROJECTS", "SUMMARY",
        "WORK EXPERIENCE", "ACHIEVEMENTS",
        "الخبرات", "المهارات", "التعليم", "اللغات", "المشاريع"
    ]
    for section in sections:
        text = re.sub(
            rf'\b({re.escape(section)})\b',
            rf'\n\n--- {section} ---\n',
            text,
            flags=re.IGNORECASE
        )
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()
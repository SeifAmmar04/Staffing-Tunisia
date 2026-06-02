"""
main.py — Staffing Tunisia IA Service
======================================
Architecture :
  1. extractor.py       → texte brut depuis PDF/DOCX
  2. extractor_groq.py  → Groq extrait données structurées (pas de score)
  3. matching_engine.py → NOTRE algorithme calcule le score final
  4. PostgreSQL         → sauvegarde score + resume
"""

import os
import psycopg2
import urllib.request
import tempfile
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

from extractor import extract_text, clean_text
from extractorgroq import extract_structured_data
from matching_engine import calculate_final_score

load_dotenv()
app = FastAPI(title="Staffing Tunisia - IA Service", version="2.0")


# ─────────────────────────────────────────────
# Connexion DB
# ─────────────────────────────────────────────

def get_db():
    return psycopg2.connect(os.getenv("DATABASE_URL"))


# ─────────────────────────────────────────────
# Schéma de la requête
# ─────────────────────────────────────────────

class ScoreRequest(BaseModel):
    application_id: int
    resume_path: str
    offre_title: str
    offre_description: str
    offre_requirements: str = ""


# ─────────────────────────────────────────────
# Root
# ─────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "ok"}


# ─────────────────────────────────────────────
# Health check
# ─────────────────────────────────────────────

@app.get("/health")
def health():
    return {
        "status": "ok",
        "version": "2.0",
        "architecture": ["extractor → Groq (structured)", "matching_engine (our algo)", "PostgreSQL"]
    }


# ─────────────────────────────────────────────
# Endpoint principal
# ─────────────────────────────────────────────

@app.post("/score")
def score_application(req: ScoreRequest):

    # ── Étape 1 : télécharger le CV depuis Cloudinary ──
    try:
        with urllib.request.urlopen(req.resume_path) as response:
            cv_bytes = response.read()
            content_type = response.headers.get('Content-Type', '')
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Impossible de télécharger le CV : {str(e)}")

    # ── Étape 2 : détecter le vrai type de fichier ──
    if 'pdf' in content_type:
        suffix = '.pdf'
    elif 'word' in content_type or 'openxml' in content_type:
        suffix = '.docx'
    elif 'pdf' in req.resume_path.lower():
        suffix = '.pdf'
    elif 'docx' in req.resume_path.lower() or 'word' in req.resume_path.lower():
        suffix = '.docx'
    else:
        # Détecter depuis les magic bytes (fiable à 100%)
        suffix = '.pdf' if cv_bytes[:4] == b'%PDF' else '.docx'

    print(f"📄 Fichier détecté comme : {suffix} (Content-Type: {content_type})")

    # ── Étape 3 : sauvegarder temporairement ──
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(cv_bytes)
        tmp_path = tmp.name

    # ── Étape 4 : extraction texte ──
    raw_text = extract_text(tmp_path)
    cv_text  = clean_text(raw_text)

    if not cv_text:
        raise HTTPException(status_code=400, detail="CV vide ou illisible")

    # ── Étape 5 : Groq → données structurées ──
    structured = extract_structured_data(
        cv_text            = cv_text,
        offre_title        = req.offre_title,
        offre_description  = req.offre_description,
        offre_requirements = req.offre_requirements
    )
    print("🔥 GROQ OUTPUT:", structured)

    if structured.get("is_cv") is False:
        result = {
            "score": 0.0, "score_100": 0.0,
            "resume": "Document invalide : ce fichier n'est pas un CV.",
            "breakdown": {"skills": 0, "experience": 0, "semantic": 0, "projects": 0},
            "explanation": "Le document fourni n'est pas un CV.",
        }
        _save_to_db(req.application_id, result["score"], result["resume"])
        return {"application_id": req.application_id, **result}

    if structured.get("is_cv") is None:
        raise HTTPException(status_code=502, detail=f"Erreur extraction Groq : {structured.get('error')}")

    # ── Étape 6 : scoring ──
    cv_data  = structured.get("cv",  {})
    job_data = structured.get("job", {})
    result   = calculate_final_score(cv_data, job_data)

    _save_to_db(req.application_id, result["score"], result["resume"])

    return {
        "application_id":  req.application_id,
        "score":           result["score"],
        "score_100":       result["score_100"],
        "resume":          result["resume"],
        "breakdown":       result["breakdown"],
        "explanation":     result["explanation"],
        "structured_data": {"cv": cv_data, "job": job_data},
    }


# ─────────────────────────────────────────────
# Helper DB
# ─────────────────────────────────────────────

def _save_to_db(application_id: int, score: float, resume: str):
    try:
        conn = get_db()
        cur  = conn.cursor()
        cur.execute(
            'UPDATE "Application" SET score = %s, score_resume = %s WHERE id = %s',
            (score, resume, application_id)
        )
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur DB : {str(e)}")

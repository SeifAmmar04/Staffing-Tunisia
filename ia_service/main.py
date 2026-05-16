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
# Endpoint principal
# ─────────────────────────────────────────────

@app.post("/score")
def score_application(req: ScoreRequest):
    """
    Flow complet :
      CV (fichier) → texte → Groq (extraction) → Matching Engine (score) → DB
    """

    # ── Étape 1 : résoudre le chemin du CV ──
    uploads_path = os.getenv("UPLOADS_PATH", "../backend")
    resume_clean = req.resume_path.replace("\\", "/").lstrip("/")
    full_path    = os.path.normpath(os.path.join(uploads_path, resume_clean))

    if not os.path.exists(full_path):
        raise HTTPException(status_code=404, detail=f"Fichier introuvable : {full_path}")

    # ── Étape 2 : extraction texte brut ──
    raw_text = extract_text(full_path)
    cv_text  = clean_text(raw_text)

    if not cv_text:
        raise HTTPException(status_code=400, detail="CV vide ou illisible")

    # ── Étape 3 : Groq → données structurées ──
    structured = extract_structured_data(
        cv_text          = cv_text,
        offre_title      = req.offre_title,
        offre_description= req.offre_description,
        offre_requirements=req.offre_requirements
    )
    print("🔥 GROQ OUTPUT:", structured) 
    # Vérification : est-ce un vrai CV ?
    if structured.get("is_cv") is False:
        result = {
            "score":    0.0,
            "score_100": 0.0,
            "resume":  "Document invalide : ce fichier n'est pas un CV.",
            "breakdown": {"skills": 0, "experience": 0, "semantic": 0, "projects": 0},
            "explanation": "Le document fourni n'est pas un CV.",
        }
        _save_to_db(req.application_id, result["score"], result["resume"])
        return {"application_id": req.application_id, **result}

    # Erreur Groq → score 0 avec message
    if structured.get("is_cv") is None:
        raise HTTPException(status_code=502, detail=f"Erreur extraction Groq : {structured.get('error')}")

    # ── Étape 4 : NOTRE algorithme de scoring ──
    cv_data  = structured.get("cv",  {})
    job_data = structured.get("job", {})
    result   = calculate_final_score(cv_data, job_data)

    # ── Étape 5 : sauvegarder en DB ──
    _save_to_db(req.application_id, result["score"], result["resume"])

    return {
        "application_id": req.application_id,
        "score":          result["score"],         # /10 — compatible DB
        "score_100":      result["score_100"],     # /100 — pour le frontend
        "resume":         result["resume"],
        "breakdown":      result["breakdown"],
        "explanation":    result["explanation"],
        "structured_data": {                       # debug — données extraites par Groq
            "cv":  cv_data,
            "job": job_data
        
        },
        
        
    }


# ─────────────────────────────────────────────
# Endpoint de matching direct (sans fichier)
# ─────────────────────────────────────────────

class MatchRequest(BaseModel):
    cv_text: str
    offre_title: str
    offre_description: str
    offre_requirements: str = ""


@app.post("/match")
def match_direct(req: MatchRequest):
    """
    Matching sans fichier — utile pour tester ou pour le frontend.
    Envoie directement le texte du CV.
    """
    cv_text = clean_text(req.cv_text)
    if not cv_text:
        raise HTTPException(status_code=400, detail="CV vide")
   
    structured = extract_structured_data(
        cv_text           = cv_text,
        offre_title       = req.offre_title,
        offre_description = req.offre_description,
        offre_requirements= req.offre_requirements
    )
    
    if structured.get("is_cv") is False:
        return {"score": 0.0, "resume": "Document invalide : ce n'est pas un CV."}

    if structured.get("is_cv") is None:
        raise HTTPException(status_code=502, detail=structured.get("error"))

    result = calculate_final_score(
        cv_data  = structured.get("cv",  {}),
        job_data = structured.get("job", {})
    )

    return {
        "score":       result["score"],
        "score_100":   result["score_100"],
        "resume":      result["resume"],
        "breakdown":   result["breakdown"],
        "explanation": result["explanation"],
        "detail":      result["detail"],
        "structured":  structured
        
    }


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
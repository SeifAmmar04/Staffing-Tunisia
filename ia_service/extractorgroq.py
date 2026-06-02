import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = None

def get_client():
    global client
    if client is None:
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    return client


def extract_structured_data(cv_text: str, offre_title: str, offre_description: str, offre_requirements: str) -> dict:
    """
    Groq extrait UNIQUEMENT les données structurées — pas de score.
    Le scoring est fait par notre propre algorithme (matching_engine.py).
    """

    prompt = f"""Tu es un parseur RH. Ton seul rôle est d'extraire et structurer les informations.
Tu NE dois PAS donner de score ni de jugement. Seulement extraire les faits.

IMPORTANT — validation CV :
Si le texte n'est PAS un CV (facture, contrat, texte aléatoire...), retourne :
{{"is_cv": false}}

--- CV DU CANDIDAT ---
{cv_text[:4000]}

--- OFFRE D'EMPLOI ---
Titre : {offre_title}
Description : {offre_description}
Compétences requises : {offre_requirements or 'Non précisées'}

Retourne UNIQUEMENT ce JSON (sans texte avant ni après) :
{{
  "is_cv": true,
  "cv": {{
    "skills": ["liste", "des", "compétences", "techniques", "mentionnées"],
    "experience_years": <nombre d'années total d'expérience, 0 si aucune>,
    "education_level": "<Bac | Bac+2 | Bac+3 | Bac+5 | Doctorat | Non précisé>",
    "projects": ["liste", "des", "projets", "ou", "réalisations"],
    "languages": ["Français", "Anglais", "..."],
    "profile_summary": "<résumé du profil en 10 mots max>"
  }},
  "job": {{
    "skills_required": ["liste", "des", "compétences", "demandées"],
    "experience_required": <nombre d'années demandées, 0 si non précisé>,
    "education_required": "<Bac | Bac+2 | Bac+3 | Bac+5 | Doctorat | Non précisé>",
    "domain": "<domaine principal du poste en 3 mots max>"
  }}
}}"""

    try:
        response = get_client().chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.0,   # déterministe — on veut des faits, pas de créativité
            max_tokens=800
        )
        raw = response.choices[0].message.content.strip()

        # Nettoyer les éventuels backticks markdown
        raw = raw.replace("```json", "").replace("```", "").strip()
        result = json.loads(raw)

        if not result.get("is_cv", True):
            return {"is_cv": False}

        return result

    except json.JSONDecodeError as e:
        return {"is_cv": None, "error": f"JSON invalide : {str(e)}", "raw": raw}
    except Exception as e:
        return {"is_cv": None, "error": f"Erreur Groq : {str(e)}"}

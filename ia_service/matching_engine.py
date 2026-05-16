"""
matching_engine.py
==================
Algorithme de matching CV ↔ Offre.
Groq extrait les données → ce module calcule le score final.

Formule finale :
  Score = 0.40 × skills_score
        + 0.30 × experience_score (pondéré par domain_relevance)
        + 0.20 × semantic_score
        + 0.10 × projects_score

  Si skills_score == 0.0     → pénalité × 0.10 (quasi 0)
  Si domain_relevance < 0.15 → pénalité × 0.15
  Si domain_relevance < 0.30 → pénalité × 0.40
"""

from difflib import SequenceMatcher


# ─────────────────────────────────────────────
# UTILITAIRES
# ─────────────────────────────────────────────

def _normalize(text: str) -> str:
    return text.lower().strip()


def _text_similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, _normalize(a), _normalize(b)).ratio()


def _skills_similar(a: str, b: str) -> bool:
    a, b = _normalize(a), _normalize(b)
    if a == b:
        return True
    if a in b or b in a:
        return True
    return SequenceMatcher(None, a, b).ratio() > 0.82


# ─────────────────────────────────────────────
# 0. DOMAIN GATE
# ─────────────────────────────────────────────

def calculate_domain_relevance(cv_skills: list, cv_profile: str,
                                job_skills: list, job_domain: str) -> float:
    """
    Vérifie si le candidat est dans le bon domaine.
    Retourne un score entre 0.0 et 1.0.
    < 0.15 → hors domaine → pénalité forte.
    < 0.30 → domaine partiel → pénalité modérée.
    """
    if not job_skills and not job_domain:
        return 1.0

    skill_matches = []
    for job_skill in job_skills:
        best = max(
            (_text_similarity(job_skill, cv_s) for cv_s in cv_skills),
            default=0.0
        )
        skill_matches.append(best)

    skills_relevance = sum(skill_matches) / len(skill_matches) if skill_matches else 0.0

    domain_relevance = 0.0
    if job_domain and cv_profile:
        domain_relevance = _text_similarity(job_domain, cv_profile)

    if job_domain and cv_profile:
        return round(0.6 * skills_relevance + 0.4 * domain_relevance, 4)
    return round(skills_relevance, 4)


# ─────────────────────────────────────────────
# 1. SKILLS SCORE  (40%)
# ─────────────────────────────────────────────

def calculate_skills_score(cv_skills: list, job_skills: list) -> dict:
    """
    Calcule le taux de couverture des compétences demandées.

    Exemple :
        CV    : ["React", "Node.js", "MongoDB", "Docker"]
        Offre : ["React", "Express", "MongoDB"]
        Communs : React, MongoDB → 2/3 = 0.667
    """
    if not job_skills:
        return {"score": 1.0, "matched": [], "missing": [], "bonus": []}

    matched = []
    missing = []

    for req_skill in job_skills:
        found = any(_skills_similar(req_skill, cv_skill) for cv_skill in cv_skills)
        if found:
            matched.append(req_skill)
        else:
            missing.append(req_skill)

    bonus = [s for s in cv_skills if not any(_skills_similar(s, r) for r in job_skills)]
    score = len(matched) / len(job_skills)

    return {
        "score":   round(score, 4),
        "matched": matched,
        "missing": missing,
        "bonus":   bonus[:5]
    }


# ─────────────────────────────────────────────
# 2. EXPERIENCE SCORE  (30%)
# ─────────────────────────────────────────────

def calculate_experience_score(cv_years: float, required_years: float,
                                domain_relevance: float) -> dict:
    """
    L'expérience ne compte QUE si le candidat est dans le bon domaine.
    domain_relevance < 0.15 → expérience hors domaine → score = 0

    Exemple :
        CV = 2 ans, Offre = 3 ans, domain = 1.0  → 2/3 = 0.667
        CV = 5 ans, Offre = 3 ans, domain = 1.0  → min(5/3,1) = 1.0
        CV = 5 ans, Offre = 5 ans, domain = 0.05 → 0.0 (hors domaine)
    """
    if required_years <= 0:
        return {
            "score":          1.0,
            "cv_years":       cv_years,
            "required_years": required_years,
            "note":           "Aucune exigence"
        }

    if domain_relevance < 0.15:
        return {
            "score":            0.0,
            "cv_years":         cv_years,
            "required_years":   required_years,
            "gap_years":        required_years,
            "domain_relevance": domain_relevance,
            "note":             "Expérience hors domaine — non comptabilisée"
        }

    raw_score      = min(cv_years / required_years, 1.0)
    adjusted_score = raw_score * domain_relevance
    gap            = max(required_years - cv_years, 0)

    return {
        "score":            round(adjusted_score, 4),
        "cv_years":         cv_years,
        "required_years":   required_years,
        "gap_years":        gap,
        "domain_relevance": domain_relevance,
        "note":             f"Expérience ajustée par pertinence domaine ({int(domain_relevance * 100)}%)"
    }


# ─────────────────────────────────────────────
# 3. PROJECTS SCORE  (10%)
# ─────────────────────────────────────────────

def calculate_projects_score(cv_projects: list, job_skills: list,
                              job_domain: str = "") -> dict:
    """
    Mesure si les projets du CV sont pertinents pour le domaine de l'offre.
    """
    if not cv_projects:
        return {"score": 0.0, "relevant_count": 0, "total": 0}

    reference_terms = job_skills + ([job_domain] if job_domain else [])

    if not reference_terms:
        return {"score": 0.5, "relevant_count": len(cv_projects), "total": len(cv_projects)}

    relevant = 0
    for project in cv_projects:
        best_sim = max(_text_similarity(project, term) for term in reference_terms)
        if best_sim > 0.30:
            relevant += 1

    score = relevant / len(cv_projects)

    return {
        "score":          round(score, 4),
        "relevant_count": relevant,
        "total":          len(cv_projects)
    }


# ─────────────────────────────────────────────
# 4. SEMANTIC SCORE  (20%)
# ─────────────────────────────────────────────

def calculate_semantic_score(cv_skills: list, cv_profile: str,
                              job_skills: list, job_domain: str) -> dict:
    """
    Score sémantique sans API externe.
    Compare le profil CV aux termes de l'offre via similarité de chaîne.
    """
    if not job_skills and not job_domain:
        return {"score": 0.5, "note": "Données offre insuffisantes"}

    sem_scores = []
    for req in job_skills:
        best = max(
            (_text_similarity(req, cv_s) for cv_s in cv_skills),
            default=0.0
        )
        sem_scores.append(best)

    skills_sem   = sum(sem_scores) / len(sem_scores) if sem_scores else 0.0
    domain_match = 0.0

    if job_domain and cv_profile:
        domain_match = _text_similarity(job_domain, cv_profile)

    if job_domain and cv_profile:
        final = 0.7 * skills_sem + 0.3 * domain_match
    else:
        final = skills_sem

    return {
        "score":           round(final, 4),
        "skills_semantic": round(skills_sem, 4),
        "domain_match":    round(domain_match, 4)
    }


# ─────────────────────────────────────────────
# 5. SCORE FINAL
# ─────────────────────────────────────────────

WEIGHTS = {
    "skills":     0.40,
    "experience": 0.30,
    "semantic":   0.20,
    "projects":   0.10,
}


def calculate_final_score(cv_data: dict, job_data: dict) -> dict:
    """
    Fonction principale du Matching Engine.

    Paramètres (issus de Groq extractor_groq.py) :
        cv_data  : {"skills", "experience_years", "projects", "profile_summary"}
        job_data : {"skills_required", "experience_required", "domain"}

    Retourne :
        {
          "score":     7.85,   ← sur 10  (compatible DB)
          "score_100": 78.5,   ← sur 100 (frontend)
          "resume":    "...",
          "breakdown": {...},
          "explanation": "...",
          "detail":    {...}
        }
    """

    cv_skills    = cv_data.get("skills", [])
    cv_exp_years = float(cv_data.get("experience_years", 0))
    cv_projects  = cv_data.get("projects", [])
    cv_profile   = cv_data.get("profile_summary", "")

    job_skills  = job_data.get("skills_required", [])
    job_exp_req = float(job_data.get("experience_required", 0))
    job_domain  = job_data.get("domain", "")

    # ── Étape 0 : Domain Gate ──
    domain_relevance = calculate_domain_relevance(
        cv_skills, cv_profile, job_skills, job_domain
    )

    # ── Étape 1-4 : Calcul des composantes ──
    s_skills   = calculate_skills_score(cv_skills, job_skills)
    s_exp      = calculate_experience_score(cv_exp_years, job_exp_req, domain_relevance)
    s_projects = calculate_projects_score(cv_projects, job_skills, job_domain)
    s_semantic = calculate_semantic_score(cv_skills, cv_profile, job_skills, job_domain)

    # ── Étape 5 : Score pondéré ──
    final_0_1 = (
        WEIGHTS["skills"]     * s_skills["score"]   +
        WEIGHTS["experience"] * s_exp["score"]      +
        WEIGHTS["semantic"]   * s_semantic["score"] +
        WEIGHTS["projects"]   * s_projects["score"]
    )

    # ── Étape 6 : Pénalités ──
    skills_score_val = s_skills["score"]

    if skills_score_val == 0.0:
        # 0 compétence matchée → score quasi 0 peu importe le reste
        final_0_1 = final_0_1 * 0.10

    elif domain_relevance < 0.15:
        # Hors domaine total
        final_0_1 = final_0_1 * 0.15

    elif domain_relevance < 0.30:
        # Hors domaine partiel
        final_0_1 = final_0_1 * 0.40

    score_100 = round(final_0_1 * 100, 1)
    score_10  = round(final_0_1 * 10,  2)

    explanation = _build_explanation(s_skills, s_exp, score_100, domain_relevance)
    resume      = _build_resume(s_skills, s_exp, score_100, domain_relevance)

    return {
        "score":     score_10,
        "score_100": score_100,
        "resume":    resume,
        "breakdown": {
            "skills":           round(s_skills["score"]   * 100, 1),
            "experience":       round(s_exp["score"]      * 100, 1),
            "semantic":         round(s_semantic["score"] * 100, 1),
            "projects":         round(s_projects["score"] * 100, 1),
            "domain_relevance": round(domain_relevance    * 100, 1),
        },
        "explanation": explanation,
        "detail": {
            "skills":           s_skills,
            "experience":       s_exp,
            "semantic":         s_semantic,
            "projects":         s_projects,
            "domain_relevance": domain_relevance,
        },
    }


# ─────────────────────────────────────────────
# HELPERS TEXTUELS
# ─────────────────────────────────────────────

def _build_explanation(s_skills: dict, s_exp: dict,
                        score_100: float, domain_relevance: float = 1.0) -> str:
    parts = []

    if s_skills["score"] == 0.0:
        parts.append("⚠️ Aucune compétence requise trouvée dans le CV.")

    if domain_relevance < 0.15:
        parts.append("⚠️ Candidat hors domaine — expérience non comptabilisée.")

    matched = s_skills.get("matched", [])
    missing = s_skills.get("missing", [])

    if matched:
        parts.append(f"Compétences correspondantes : {', '.join(matched[:4])}.")
    if missing:
        parts.append(f"Compétences manquantes : {', '.join(missing[:3])}.")

    gap = s_exp.get("gap_years", 0)
    if gap > 0:
        parts.append(f"Expérience insuffisante de {gap:.0f} an(s).")
    elif s_exp.get("cv_years", 0) > 0:
        parts.append(
            f"Expérience : {s_exp['cv_years']:.0f} an(s) "
            f"(requis : {s_exp['required_years']:.0f})."
        )

    return " ".join(parts) if parts else "Profil analysé."


def _build_resume(s_skills: dict, s_exp: dict,
                  score_100: float, domain_relevance: float = 1.0) -> str:

    if s_skills["score"] == 0.0:
        return "Profil non compatible — aucune compétence requise présente dans le CV."

    if domain_relevance < 0.15:
        return "Profil hors domaine — compétences et expérience non pertinentes pour ce poste."

    matched_count = len(s_skills.get("matched", []))
    total_req     = matched_count + len(s_skills.get("missing", []))

    if score_100 >= 85:
        return f"Excellent profil — {matched_count}/{total_req} compétences clés maîtrisées, forte adéquation avec le poste."
    elif score_100 >= 70:
        return f"Bon profil — {matched_count}/{total_req} compétences requises, correspondance satisfaisante avec l'offre."
    elif score_100 >= 50:
        return f"Profil moyen — {matched_count}/{total_req} compétences, manque d'expérience ou de compétences clés."
    else:
        return f"Profil faible — seulement {matched_count}/{total_req} compétences requises présentes."
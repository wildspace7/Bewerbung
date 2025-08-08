# FastAPI-App: Stellt Endpunkte bereit für Extraktion, Matching und Generierung
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .schemas import JDExtract, CVExtract, MatchResult, GenerateRequest, GenerateResponse
from .nlp import extract_keywords, find_evidence, ats_score
from .templates import build_cover_letter

# API-Server starten
app = FastAPI(title="Bewerbung – ATS Cover Letter Backend")

# CORS aktivieren (damit das Frontend im Browser mit dem Backend sprechen kann)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Extrahiert Keywords aus einer Stellenanzeige
@app.post("/extract/jd")
def extract_jd(jd: JDExtract):
    kws = extract_keywords(jd.raw_text)
    must = kws[: min(6, len(kws))]
    nice = kws[min(6, len(kws)) :]
    return {"must_have": must, "nice_to_have": nice, "keywords": kws}

# Extrahiert Keywords und Bullets aus einem CV
@app.post("/extract/cv")
def extract_cv(cv: CVExtract):
    kws = extract_keywords(cv.raw_text)
    bullets = [s.strip("- •") for s in cv.raw_text.split("\n") if s.strip()]
    return {"keywords": kws, "bullets": bullets}

# Matcht CV gegen JD und liefert passende Belege zurück
@app.post("/match", response_model=MatchResult)
def match(jd: JDExtract, cv: CVExtract):
    jd_kws = extract_keywords(jd.raw_text)
    ev = find_evidence(jd_kws, cv.raw_text)
    must = jd_kws[: min(6, len(jd_kws))]
    nice = jd_kws[min(6, len(jd_kws)) :]
    return MatchResult(must_have=must, nice_to_have=nice, keywords=jd_kws, evidence=ev)

# Erstellt ein Anschreiben und bewertet es
@app.post("/generate", response_model=GenerateResponse)
def generate(req: GenerateRequest):
    jd_kws = extract_keywords(req.jd.raw_text)
    ev = find_evidence(jd_kws, req.cv.raw_text)
    letter = build_cover_letter(req.jd.title, req.jd.company, req.tone, jd_kws, ev, req.cv.name, req.max_words)
    score, diag = ats_score(letter, jd_kws)
    return GenerateResponse(cover_letter=letter, score=round(score, 3), diagnostics=diag)

# Pydantic-Modelle: Definieren, wie Daten aussehen, die unsere API erhält oder zurückgibt
from pydantic import BaseModel, Field
from typing import List, Optional

# Modell für die Stellenanzeige (Job Description)
class JDExtract(BaseModel):
    title: str                     # Titel der Position (z.B. "Data Analyst")
    company: Optional[str] = None  # Name der Firma (optional)
    raw_text: str                   # Volltext der Stellenanzeige

# Modell für den Lebenslauf
class CVExtract(BaseModel):
    name: str                       # Name des Bewerbers
    raw_text: str                   # Volltext oder Stichpunkte aus dem CV

# Modell für das Matching-Ergebnis zwischen Job und CV
class MatchResult(BaseModel):
    must_have: List[str]            # Muss-Skills laut JD
    nice_to_have: List[str]         # Kann-Skills laut JD
    keywords: List[str]             # Alle extrahierten Schlüsselwörter
    evidence: List[str]             # Belege aus dem CV, die zu den Keywords passen

# Modell für die Anfrage an den Generator (JD + CV + Ton + max. Wörter)
class GenerateRequest(BaseModel):
    jd: JDExtract                   # Die Stellenanzeige
    cv: CVExtract                   # Der Lebenslauf
    tone: str = Field(default="professionell") # gewünschter Schreibstil
    max_words: int = Field(default=220)        # Begrenzung auf Wortanzahl

# Modell für die Antwort des Generators
class GenerateResponse(BaseModel):
    cover_letter: str               # Der generierte Anschreibentext
    score: float                    # ATS-Score (0–1)
    diagnostics: dict               # Diagnoseinfos (z.B. Keyword-Coverage)

from pydantic import BaseModel, Field
from typing import List, Optional

class JDExtract(BaseModel):
    title: str
    company: Optional[str] = None
    raw_text: str

class CVExtract(BaseModel):
    name: str
    raw_text: str

class MatchResult(BaseModel):
    must_have: List[str]
    nice_to_have: List[str]
    keywords: List[str]
    evidence: List[str]

class GenerateRequest(BaseModel):
    jd: JDExtract
    cv: CVExtract
    tone: str = Field(default="professionell")
    max_words: int = Field(default=220)

class GenerateResponse(BaseModel):
    cover_letter: str
    score: float
    diagnostics: dict

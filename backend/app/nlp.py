import re
from typing import List, Tuple

KEYWORDS_HINTS = ["SQL", "DBT", "Stakeholder", "KPI", "E-Commerce", "Python", "Power BI", "Controlling", "Budget", "CRM", "HubSpot", "Forecast", "AWS", "Azure"]

SKILL_PATTERNS = [r"\bSQL\b", r"\bDBT\b", r"Stakeholder(?:-?management)?", r"KPI(?:s)?", r"E-?Commerce", r"Python", r"Power\s?BI", r"Controlling", r"Budget", r"CRM", r"HubSpot", r"Forecast", r"AWS", r"Azure"]

def extract_keywords(text: str) -> List[str]:
    kws = set()
    for pat in SKILL_PATTERNS:
        for m in re.finditer(pat, text, re.IGNORECASE):
            kws.add(m.group(0))
    return sorted(kws, key=lambda x: x.lower())

def split_sentences(text: str) -> List[str]:
    parts = re.split(r"(?<=[.!?])\s+", text.strip())
    return [p.strip() for p in parts if p.strip()]

def find_evidence(jd_kws: List[str], cv_text: str) -> List[str]:
    sentences = split_sentences(cv_text)
    ev = []
    for s in sentences:
        for kw in jd_kws:
            if re.search(rf"\b{re.escape(kw)}\b", s, re.IGNORECASE):
                ev.append(s)
                break
    return ev[:6]

def ats_score(cover_letter: str, jd_kws: List[str]) -> Tuple[float, dict]:
    found = [kw for kw in jd_kws if re.search(rf"\b{re.escape(kw)}\b", cover_letter, re.IGNORECASE)]
    coverage = len(found) / max(1, len(jd_kws))
    score = max(0.0, min(1.0, 0.6 * coverage + 0.4))
    diag = {"keyword_coverage": coverage, "found_keywords": found}
    return score, diag

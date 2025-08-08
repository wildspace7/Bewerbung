# Baut das Anschreiben aus JD-Infos, CV-Belegen und gewünschtem Tonfall zusammen
def build_cover_letter(jd_title, company, tone, jd_keywords, evidence, name, max_words=220):
    # Einleitung
    company_part = f" bei {company}" if company else ""
    hook = f"Sehr geehrte Damen und Herren,\n\nals erfahrener Profi mit klarem Fokus auf Wirkung und Struktur bewerbe ich mich auf die Position {jd_title}{company_part}."
    
    # Anforderungen der Firma
    value = "\n\nWas Sie suchen: " + ", ".join(jd_keywords[:6]) + "."
    
    # Erfolge aus dem CV
    proof_lines = "\n- " + "\n- ".join(evidence) if evidence else ""
    
    # Abschluss
    close = f"\n\nGern erläutere ich meinen Ansatz und konkrete Ergebnisse im Gespräch.\n\nMit freundlichen Grüßen\n{name}"
    
    # Alles zusammenfügen
    text = hook + value + "\n\nRelevante Erfolge:" + proof_lines + close
    
    # Falls Wortlimit überschritten → kürzen
    words = text.split()
    if len(words) > max_words:
        text = " ".join(words[:max_words]) + " …"
    
    return text

cd ~/Bewerbung/Bewerbung/frontend/pages
cp index.js index.backup.js

// Frontend-Formular, das JD + CV an das Backend /generate schickt
// und das generierte Anschreiben + ATS-Score anzeigt.

import { useState } from "react";

// Basis-URL des Backends (kommt aus .env.local)
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

export default function Home() {
  // --- Formularzustände (Eingaben) ---
  const [jdTitle, setJdTitle] = useState("Senior Data Analyst");
  const [jdCompany, setJdCompany] = useState("Beispiel GmbH");
  const [jdText, setJdText] = useState(
    "Wir suchen SQL, DBT, KPI-Design und Stakeholder-Management im E-Commerce."
  );
  const [cvName, setCvName] = useState("Max Mustermann");
  const [cvText, setCvText] = useState(
    "- SQL-DWH optimiert, Abfragezeit -38%\n- DBT-Pipelines für 120+ Modelle, Fehlerrate -22%\n- KPI-Deck für Management"
  );
  const [tone, setTone] = useState("professionell");

  // --- Ergebniszustände (Ausgaben/Status) ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [letter, setLetter] = useState("");
  const [score, setScore] = useState(null);
  const [diag, setDiag] = useState(null);

  // Klick-Handler: schickt die Daten an das Backend und setzt die Ergebnisse
  async function handleGenerate() {
    setLoading(true);
    setError("");
    setLetter("");
    setScore(null);
    setDiag(null);

    try {
      const res = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jd: { title: jdTitle, company: jdCompany, raw_text: jdText },
          cv: { name: cvName, raw_text: cvText },
          tone,
          max_words: 220,
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Backend-Fehler (${res.status}): ${txt}`);
      }

      const data = await res.json();
      setLetter(data.cover_letter);
      setScore(data.score);
      setDiag(data.diagnostics);
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  // UI: Formular links, Ergebnis rechts
  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, background: "#dbead3", padding: 12 }}>
        Bewerbung ATS Generator
      </h1>
      <p>API: {API_BASE}</p>

      {/* Formular */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <section>
          <h2>Stellenanzeige</h2>
          <input
            value={jdTitle}
            onChange={(e) => setJdTitle(e.target.value)}
            placeholder="Titel"
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <input
            value={jdCompany}
            onChange={(e) => setJdCompany(e.target.value)}
            placeholder="Firma (optional)"
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Volltext der JD"
            rows={8}
            style={{ width: "100%", padding: 8 }}
          />
        </section>

        <section>
          <h2>Lebenslauf</h2>
          <input
            value={cvName}
            onChange={(e) => setCvName(e.target.value)}
            placeholder="Dein Name"
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <textarea
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            placeholder="Erfolge/Bullets"
            rows={9}
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <label>Ton:</label>
            <select value={tone} onChange={(e) => setTone(e.target.value)} style={{ padding: 8 }}>
              <option value="professionell">Professionell</option>
              <option value="impact">Impact-getrieben</option>
              <option value="team">Teamorientiert</option>
            </select>
            <button
              onClick={handleGenerate}
              disabled={loading}
              style={{ padding: "8px 12px", background: "black", color: "white", border: "none", cursor: "pointer" }}
            >
              {loading ? "Erzeuge..." : "Anschreiben erzeugen"}
            </button>
          </div>
        </section>
      </div>

      {/* Fehleranzeige */}
      {error ? <p style={{ color: "crimson", marginTop: 16 }}>{error}</p> : null}

      {/* Ergebnisanzeige */}
      {letter || score !== null ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24 }}>
          <section>
            <h3>Entwurf</h3>
            <textarea
              value={letter}
              onChange={(e) => setLetter(e.target.value)}
              rows={16}
              style={{ width: "100%", padding: 8 }}
            />
          </section>
          <section>
            <h3>ATS-Score & Diagnose</h3>
            <div style={{ border: "1px solid #ddd", padding: 12 }}>
              <p>
                <strong>Score:</strong> {score !== null ? Math.round(score * 100) + "%" : "-"}
              </p>
              <p style={{ fontSize: 14, color: "#555" }}>
                {diag ? `Keyword Coverage: ${Math.round(diag.keyword_coverage * 100)}%` : ""}
              </p>
              <p style={{ fontSize: 14, color: "#555" }}>
                {diag && diag.found_keywords && diag.found_keywords.length
                  ? `Gefundene Keywords: ${diag.found_keywords.join(", ")}`
                  : ""}
              </p>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}

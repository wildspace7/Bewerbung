# Urlaubsplaner App — Projektkontext für Claude Code

Diese Datei wird bei jeder Claude-Code-Session automatisch gelesen. Sie ist die
Single Source of Truth für Stack, Datenmodell, Design und Roadmap. Bei
Unklarheiten in einer Session: hier nachschlagen statt neu zu entscheiden.

## Projektziel

Eine App, in der ein Urlaub als Projekt angelegt wird — mit Terminplan, Kosten,
Kostenaufteilung zwischen Mitreisenden, Packliste und Fotos/Tagebuch.

**Leitprinzipien:**

- Mobile-first für Ausgaben-Erfassung (das meistgenutzte Feature)
- Kostengünstig betreiben — keine kostenpflichtigen APIs, siehe Abschnitt „APIs"
- Kein Feature-Overkill — MVP zuerst, sauber erweitern statt vorbauen

## Tech-Stack

| Bereich | Wahl | Begründung |
| --- | --- | --- |
| Frontend | Next.js (App Router) | Gut dokumentiert, Claude Code arbeitet damit zuverlässig |
| Backend/DB | Supabase (Postgres + Auth + Storage) | Free-Tier reicht lange, Multi-User nötig da mehrere Teilnehmer dieselben Daten sehen |
| Auth | Supabase Auth, Magic-Link oder Google-Login | Kein eigenes Passwort-Handling nötig |
| Styling | Tailwind CSS | Design-Tokens unten 1:1 übernehmbar |
| Hosting | Vercel (Free-Tier) | Passt zu Next.js |

## APIs — bewusst kostenlos gehalten

| Funktion | API | Hinweis |
| --- | --- | --- |
| Wetter | Open-Meteo | Kein Key nötig, bis 10.000 Anfragen/Tag |
| Wechselkurse | Frankfurter.app | Kein Key, EZB-Daten |
| Karten | OpenStreetMap + Leaflet | Kostenlos, kein Google Maps |
| Beleg-OCR (später) | Tesseract.js (Client) oder Anthropic API | Keine Google Vision API |

**Regel:** Bevor eine neue externe API eingebunden wird — erst prüfen, ob es
eine kostenlose Alternative gibt (siehe Tabelle oben als Vorbild).

## Datenmodell

```sql
-- Nutzerprofil (erweitert Supabase auth.users)
profiles (
  id uuid primary key references auth.users,
  name text not null,
  avatar_url text,
  created_at timestamptz default now()
)

-- Ein Urlaub = ein Projekt
trips (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  destination text,
  start_date date,
  end_date date,
  currency text default 'EUR',
  status text default 'planning', -- 'planning' | 'active' | 'completed'
  created_by uuid references profiles(id),
  created_at timestamptz default now()
)

-- Teilnehmer eines Trips
trip_participants (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete cascade,
  profile_id uuid references profiles(id),
  role text default 'member', -- 'organizer' | 'member'
  joined_at timestamptz default now()
)

-- Ausgaben
expenses (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete cascade,
  title text not null,
  amount numeric(10,2) not null,
  currency text default 'EUR',
  category text, -- 'flug' | 'hotel' | 'essen' | 'aktivitaet' | 'transport' | 'sonstiges'
  payment_method text default 'karte', -- 'karte' | 'bargeld'
  paid_by uuid references profiles(id),
  expense_date date default current_date,
  created_at timestamptz default now()
)

-- Aufteilung einer Ausgabe auf Teilnehmer
expense_splits (
  id uuid primary key default gen_random_uuid(),
  expense_id uuid references expenses(id) on delete cascade,
  participant_id uuid references trip_participants(id),
  share_amount numeric(10,2) not null
)

-- Terminplan / Itinerary
itinerary_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete cascade,
  day_date date not null,
  start_time time,
  title text not null,
  location text,
  notes text,
  created_at timestamptz default now()
)

-- Packliste
packing_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete cascade,
  name text not null,
  category text,
  is_checked boolean default false,
  created_at timestamptz default now()
)

-- Dokumente (Tickets, Buchungen, Versicherung)
documents (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete cascade,
  name text not null,
  file_url text not null,
  doc_type text, -- 'ticket' | 'buchung' | 'versicherung' | 'sonstiges'
  uploaded_by uuid references profiles(id),
  created_at timestamptz default now()
)

-- Tagebuch / Fotos (Phase 2+)
diary_entries (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete cascade,
  entry_date date not null,
  text_content text,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
)

diary_photos (
  id uuid primary key default gen_random_uuid(),
  diary_entry_id uuid references diary_entries(id) on delete cascade,
  photo_url text not null,
  caption text,
  is_favorite boolean default false,
  created_at timestamptz default now()
)
```

**Hinweis Kostenaufteilung:** `expense_splits.share_amount` wird bei jeder
Ausgabe direkt berechnet und gespeichert (nicht erst am Ende) — das ermöglicht
laufende „Wer schuldet wem"-Anzeige statt Nachrechnen am Reiseende.

> Umgesetzt als Migration: `supabase/migrations/0001_init.sql`

## Design-System — Light Glassmorphism v1.0

### Farben

| Name | Hex | Verwendung |
| --- | --- | --- |
| Sky | `#EAF3FB` | Hintergrund-Verlauf oben |
| Dawn | `#FDEEDD` | Hintergrund-Verlauf unten |
| Blush | `#FBE1E3` | Dritter Verlaufspunkt |
| Coral | `#F0865A` | Primär-CTA, aktive Dots, Badges |
| Coral Deep | `#E06A3E` | Gradient-Ende bei Buttons |
| Teal | `#3E93A6` | Sekundär-Akzent, z. B. Icons |
| Ink | `#25324A` | Haupttext, Headlines |
| Ink Soft | `#5C6C82` | Sekundärtext, Beschreibungen |
| Ink Faint | `#8B98AC` | Labels, dezente Hinweise |
| Blob Blue | `#BFD9F2` | Hintergrund-Blob, Tiefe |
| Blob Peach | `#F6C9B0` | Hintergrund-Blob, Tiefe |
| Blob Pink | `#E9C6D8` | Hintergrund-Blob, Tiefe |

**Glass-Werte:**

- Card-Glass: `background: rgba(255,255,255,0.62–0.68)`, `backdrop-filter: blur(18px)`, `border: 1px solid rgba(255,255,255,0.75)`
- Chip-Glass (kleiner): `background: rgba(255,255,255,0.62)`, `backdrop-filter: blur(14px)`
- Card-Schatten: `0 20px 40px -18px rgba(90,100,150,0.35)`
- Button-Schatten (Coral): `0 12px 24px -8px rgba(224,106,62,0.55)`
- Ambient-Blobs: `blur(60px)`, `opacity 0.55`, für Hintergrundtiefe

### Typografie

Eine Schrift für alles: **Plus Jakarta Sans** (Google Fonts, Gewichte 400–800).
Mono (nur für Hex-Codes/Zahlen in Referenzdokumenten, nicht im App-UI):
JetBrains Mono.

| Rolle | Größe | Gewicht |
| --- | --- | --- |
| Display / H1 | 32px (-0.5px LS) | 800 |
| H2 / Screen-Titel | 22px | 800 |
| H3 / Card-Titel | 17px | 700 |
| Body | 14px (1.55 LH) | 500 |
| Body Small | 12.5px | 500 |
| Label / Caption | 10.5px, Uppercase, 0.6px LS | 700 |
| Button | 14.5px | 700 |

### Radius-Skala

`xs` 10px (Chips) · `sm` 14px (Icon-Buttons) · `md` 16px (Buttons/Inputs) ·
`lg` 22px (kleine Cards) · `xl` 26px (Haupt-Cards) · `xxl` 46px (Device-Frame)

### Komponenten (Referenz)

- **Primary Button**: `border-radius: 16px`, `padding: 13px 22px`, Gradient Coral → Coral Deep
- **Text Button (sekundär)**: kein Hintergrund, `font-weight: 700`, Farbe Ink Soft
- **Icon Button**: 40×40px, `border-radius: 14px`, Glass-Fill
- **Glass Card**: `border-radius: 22px`, Glass-Fill Strong, `blur(16px)`
- **Floating Chip**: `border-radius: 14px`, oft leicht rotiert (−8deg)
- **Progress Dots**: aktiv 20×6px Coral · inaktiv 6×6px `rgba(ink,0.18)`
- **Input Field**: `border-radius: 16px`, Glass-Fill, Fokus-Border Coral

> Umgesetzt als Tailwind-Theme-Tokens: `src/app/globals.css` (`@theme` Block).
> Referenzmaterial (als Vorlage genutzt, `reference/`-Ordner):
> `Sitemap_Urlaubsplaner.html`. `Design_System_Urlaubsplaner` und
> `Onboarding_Glassmorphism_Hell` lagen nur als Upload vor, nicht im Repo.

## Sitemap — Screens für MVP (Phase 1–3)

| # | Screen | Phase |
| --- | --- | --- |
| 1 | Onboarding (1–2 Screens) | 1 |
| 2 | Login / Magic-Link | 1 |
| 3 | Trip-Liste (alle Trips) | 1 |
| 4 | Trip erstellen | 1 |
| 5 | Trip-Dashboard (Kosten, nächster Termin, Schulden) | 1 |
| 6 | Ausgabe hinzufügen (Modal/Formular) | 1 |
| 7 | Ausgaben-Liste | 1 |
| 8 | Kostenaufteilung / Wer-schuldet-wem | 1 |
| 9 | Teilnehmer verwalten / Einladungslink | 1 |
| 10 | Terminplan (Tagesansicht) | 2 |
| 11 | Packliste | 2 |
| 12 | Dokumente-Upload | 3 |
| 13 | Tagebuch / Fotos | 2–3 |
| 14 | Trip-Einstellungen | 2 |

> Umgesetzt: Screen 3 „Trip-Liste" (leerer Zustand + Liste) unter
> `src/app/trips/page.tsx`. Visuelle Navigationsstruktur:
> `reference/Sitemap_Urlaubsplaner.html`.

### Architektur-Erkenntnisse aus der Sitemap

- **Trip-Dashboard ist der Flaschenhals** — sechs Screens (Terminplan,
  Ausgaben, Packliste, Dokumente, Tagebuch, Teilnehmer & Einstellungen) hängen
  direkt daran. Dieser Screen sollte als robuste Tab-/Nav-Struktur gebaut
  werden, nicht als einfache Detailseite — hier trifft man die
  Navigations-Grundentscheidung fürs ganze Projekt.
- **Ausgaben-Liste braucht eigene Unternavigation** — sie hat zwei
  Kind-Screens (Ausgabe hinzufügen, Kostenaufteilung), mehr Tiefe als die
  übrigen Tabs. Sollte als eigener Bereich mit interner Navigation behandelt
  werden, nicht als schlichter Dashboard-Tab.

## User Flow — kritischer Pfad (Phase 1)

Dieser Pfad muss ohne Reibung funktionieren, bevor irgendein Phase-2-Feature
angefasst wird — er ist der Alltag, an dem die App sich beweist.

```
Login (Magic-Link)
  └─→ Trip erstellen (Name, Ziel, Datum)
       └─→ Teilnehmer einladen (Link teilen)
            └─→ Erste Ausgabe eintragen
                 └─→ Dashboard zeigt: Gesamtkosten, Budget-Rest, wer schuldet wem
```

## Phasenplan

| Phase | Inhalt |
| --- | --- |
| 1 — MVP | Trip anlegen, Teilnehmer einladen, Ausgaben eintragen, Kostenaufteilung (2–4 Personen) |
| 2 | Terminplan, Packliste, Tagebuch/Fotos (Basis) |
| 3 | Dokumenten-Upload, Multi-Währung, PDF-Export der Reise-Zusammenfassung |
| 4 (optional) | Push-Benachrichtigungen, Offline-Modus, Beleg-OCR |

## Coding-Konventionen für Claude-Code-Sessions

- **Kleine, klare Sessions** — eine Phase / ein Screen pro Session, nicht
  „bau die ganze App"
- **Git von Anfang an** — vor jeder größeren Änderung committen
- **Nach jeder Phase:** testen → committen → nächste Phase anstoßen
- **Neue externe Abhängigkeiten** immer gegen die Kostenlos-Alternativen-Tabelle
  oben prüfen
- **Datenmodell-Änderungen** hier in der CLAUDE.md nachtragen, damit sie in der
  nächsten Session bekannt sind

## Offene Entscheidungen (bei Bedarf ergänzen)

- Domain-/App-Name final festlegen
- Supabase-Projekt anlegen (Free-Tier) — aktuell nur Platzhalter-Env-Variablen
  in `.env.local.example`
- Vercel-Projekt verbinden

## Stand dieser Session

Umgesetzt (Next.js-Projekt liegt im Unterordner `urlaubsplaner/` dieses
Repos, da das Repo-Root ein anderes, unabhängiges Projekt enthält):

1. Next.js-Projekt (App Router, TypeScript, Tailwind CSS v4)
2. Supabase-Client (`src/lib/supabase.ts`) + `.env.local.example` mit
   Platzhaltern für `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Vollständiges Datenbankschema als Migration (`supabase/migrations/0001_init.sql`)
4. Design-Tokens als Tailwind-`@theme` in `src/app/globals.css`
5. Screen „Trip-Liste" (`src/app/trips/page.tsx`) mit leerem Zustand
   (`EmptyTripsState`) und Liste (`TripCard`)
6. Screen „Trip erstellen" (`src/app/trips/new/page.tsx`) — Formular
   (Reisename, Ziel, Start-/Enddatum), echter Supabase-Insert in `trips`,
   verlinkt von den "+"-Buttons der Trip-Liste. Ohne echtes Supabase-Projekt
   zeigt das Formular beim Absenden einen Fehlertext statt abzustürzen
   (`src/lib/supabase.ts` nutzt Platzhalter-Fallbacks, damit der Next-Build
   nicht an fehlenden Env-Variablen scheitert).

Noch offen (nicht Teil dieser Session, bewusst nicht gebaut): Auth/Login,
Onboarding, Trip-Dashboard und alle weiteren Sitemap-Screens.

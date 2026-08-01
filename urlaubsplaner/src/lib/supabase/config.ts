// Zentrale Stelle für die Supabase-Zugangsdaten.
//
// Solange kein echtes Supabase-Projekt verbunden ist (siehe .env.local.example),
// greifen Platzhalter-Werte: der Next-Build läuft dann durch, statt schon beim
// Modul-Import an fehlenden Env-Variablen zu scheitern. `isSupabaseConfigured`
// macht diesen Zustand für die UI sichtbar, damit Screens Demo-Daten zeigen
// können statt einer leeren Fehlerseite.

export const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";

export const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key";

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

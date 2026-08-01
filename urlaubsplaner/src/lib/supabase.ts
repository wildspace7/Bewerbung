import { createClient } from "@supabase/supabase-js";

// Fallback auf Platzhalter, solange kein echtes Supabase-Projekt verbunden ist
// (siehe .env.local.example) - so bricht der Build nicht, Requests schlagen
// dann erst zur Laufzeit fehl statt schon beim Modul-Import.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

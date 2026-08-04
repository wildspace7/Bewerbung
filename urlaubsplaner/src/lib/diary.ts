import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";
import { demoDiaryEntries } from "./demo-data";
import type { DiaryEntry } from "./types";

type ProfileRef = { name: string | null };

function one<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export async function getDiaryEntries(
  tripId: string,
): Promise<{ entries: DiaryEntry[]; isDemo: boolean }> {
  if (!isSupabaseConfigured) {
    return { entries: demoDiaryEntries[tripId] ?? [], isDemo: true };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("diary_entries")
    .select("id, entry_date, text_content, profiles(name)")
    .eq("trip_id", tripId)
    .order("entry_date", { ascending: false });

  if (error) throw error;

  const entries = (
    data as {
      id: string;
      entry_date: string;
      text_content: string | null;
      profiles: ProfileRef | ProfileRef[] | null;
    }[]
  ).map(
    (row): DiaryEntry => ({
      id: row.id,
      entryDate: row.entry_date,
      textContent: row.text_content,
      authorName: one(row.profiles)?.name ?? "Unbekannt",
    }),
  );

  return { entries, isDemo: false };
}

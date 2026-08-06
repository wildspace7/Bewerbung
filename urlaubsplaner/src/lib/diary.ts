import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";
import { demoDiaryEntries } from "./demo-data";
import type { DiaryEntry, DiaryPhoto } from "./types";

type ProfileRef = { name: string | null };

function one<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

const SIGNED_URL_TTL_SECONDS = 3600;

export async function getDiaryEntries(
  tripId: string,
): Promise<{ entries: DiaryEntry[]; isDemo: boolean }> {
  if (!isSupabaseConfigured) {
    return { entries: demoDiaryEntries[tripId] ?? [], isDemo: true };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("diary_entries")
    .select(
      "id, entry_date, text_content, profiles(name), diary_photos(id, photo_url, caption, is_favorite)",
    )
    .eq("trip_id", tripId)
    .order("entry_date", { ascending: false });

  if (error) throw error;

  const rows = data as {
    id: string;
    entry_date: string;
    text_content: string | null;
    profiles: ProfileRef | ProfileRef[] | null;
    diary_photos:
      | {
          id: string;
          photo_url: string;
          caption: string | null;
          is_favorite: boolean;
        }[]
      | null;
  }[];

  // Storage speichert nur Pfade (siehe 0003_storage.sql) — für die Anzeige
  // brauchen private Buckets Signed URLs, gebündelt in einem Call statt pro Foto.
  const allPaths = rows.flatMap((r) =>
    (r.diary_photos ?? []).map((p) => p.photo_url),
  );

  const signedUrlByPath = new Map<string, string>();
  if (allPaths.length > 0) {
    const { data: signed } = await supabase.storage
      .from("trip-files")
      .createSignedUrls(allPaths, SIGNED_URL_TTL_SECONDS);

    for (const s of signed ?? []) {
      if (s.signedUrl) signedUrlByPath.set(s.path ?? "", s.signedUrl);
    }
  }

  const entries = rows.map(
    (row): DiaryEntry => ({
      id: row.id,
      entryDate: row.entry_date,
      textContent: row.text_content,
      authorName: one(row.profiles)?.name ?? "Unbekannt",
      photos: (row.diary_photos ?? [])
        .map(
          (p): DiaryPhoto => ({
            id: p.id,
            url: signedUrlByPath.get(p.photo_url) ?? "",
            caption: p.caption,
            isFavorite: p.is_favorite,
          }),
        )
        .filter((p) => p.url),
    }),
  );

  return { entries, isDemo: false };
}

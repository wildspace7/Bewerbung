import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";
import { demoItinerary } from "./demo-data";
import type { ItineraryItem } from "./types";

export async function getItinerary(
  tripId: string,
): Promise<{ items: ItineraryItem[]; isDemo: boolean }> {
  if (!isSupabaseConfigured) {
    return { items: demoItinerary[tripId] ?? [], isDemo: true };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("itinerary_items")
    .select("id, day_date, start_time, title, location, notes")
    .eq("trip_id", tripId)
    .order("day_date", { ascending: true })
    .order("start_time", { ascending: true, nullsFirst: false });

  if (error) throw error;

  const items = (
    data as {
      id: string;
      day_date: string;
      start_time: string | null;
      title: string;
      location: string | null;
      notes: string | null;
    }[]
  ).map(
    (row): ItineraryItem => ({
      id: row.id,
      dayDate: row.day_date,
      startTime: row.start_time,
      title: row.title,
      location: row.location,
      notes: row.notes,
    }),
  );

  return { items, isDemo: false };
}

/** Gruppiert nach Tag, für die Tagesansicht. */
export function groupByDay(items: ItineraryItem[]) {
  const groups = new Map<string, ItineraryItem[]>();
  for (const item of items) {
    const list = groups.get(item.dayDate) ?? [];
    list.push(item);
    groups.set(item.dayDate, list);
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
}

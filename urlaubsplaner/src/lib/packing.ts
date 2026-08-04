import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";
import { demoPacking } from "./demo-data";
import type { PackingCategory, PackingItem } from "./types";

export async function getPackingItems(
  tripId: string,
): Promise<{ items: PackingItem[]; isDemo: boolean }> {
  if (!isSupabaseConfigured) {
    return { items: demoPacking[tripId] ?? [], isDemo: true };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("packing_items")
    .select("id, name, category, is_checked")
    .eq("trip_id", tripId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  const items = (
    data as {
      id: string;
      name: string;
      category: string | null;
      is_checked: boolean;
    }[]
  ).map(
    (row): PackingItem => ({
      id: row.id,
      name: row.name,
      category: row.category as PackingCategory | null,
      isChecked: row.is_checked,
    }),
  );

  return { items, isDemo: false };
}

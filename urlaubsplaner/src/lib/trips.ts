import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";
import { demoTrips } from "./demo-data";
import type { TripListItem, TripStatus } from "./types";

function initialsOf(name: string | null | undefined) {
  return (name?.trim()[0] ?? "?").toUpperCase();
}

type ProfileRef = { name: string | null };

type TripRow = {
  id: string;
  name: string;
  destination: string | null;
  start_date: string | null;
  end_date: string | null;
  currency: string | null;
  status: string | null;
  expenses: { amount: number | string }[] | null;
  // Ohne generierte DB-Typen liefert supabase-js verschachtelte Relationen als
  // Array, obwohl profile_id eine to-one-Beziehung ist — beides abfangen.
  trip_participants:
    | { profiles: ProfileRef | ProfileRef[] | null }[]
    | null;
};

function firstProfile(profiles: ProfileRef | ProfileRef[] | null) {
  return Array.isArray(profiles) ? profiles[0] : profiles;
}

function toListItem(row: TripRow): TripListItem {
  return {
    id: row.id,
    name: row.name,
    destination: row.destination,
    startDate: row.start_date,
    endDate: row.end_date,
    currency: row.currency ?? "EUR",
    status: (row.status ?? "planning") as TripStatus,
    totalSpent: (row.expenses ?? []).reduce(
      (sum, e) => sum + Number(e.amount),
      0,
    ),
    participantInitials: (row.trip_participants ?? []).map((p) =>
      initialsOf(firstProfile(p.profiles)?.name),
    ),
  };
}

export async function getTrips(): Promise<{
  trips: TripListItem[];
  isDemo: boolean;
}> {
  if (!isSupabaseConfigured) {
    return { trips: demoTrips, isDemo: true };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trips")
    .select(
      "id, name, destination, start_date, end_date, currency, status, expenses(amount), trip_participants(profiles(name))",
    )
    .order("start_date", { ascending: true, nullsFirst: false });

  if (error) throw error;

  return { trips: (data as TripRow[]).map(toListItem), isDemo: false };
}

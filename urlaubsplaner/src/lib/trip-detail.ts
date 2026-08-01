import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";
import { demoTripDetails } from "./demo-data";
import { settleDebts } from "./settle";
import type { Participant, TripDetail, TripStatus } from "./types";

type ProfileRef = { id: string; name: string | null };

// Verschachtelte Relationen kommen ohne generierte DB-Typen als Array zurück,
// obwohl es to-one-Beziehungen sind.
function one<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export async function getTripDetail(id: string): Promise<TripDetail | null> {
  if (!isSupabaseConfigured) {
    return demoTripDetails[id] ?? null;
  }

  const supabase = await createClient();

  const { data: trip, error } = await supabase
    .from("trips")
    .select(
      `id, name, destination, start_date, end_date, currency, status,
       trip_participants(id, profile_id, role, profiles(id, name)),
       expenses(id, amount, paid_by, expense_splits(participant_id, share_amount)),
       itinerary_items(title, day_date, start_time, location)`,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!trip) return null;

  const participantRows = (trip.trip_participants ?? []) as {
    id: string;
    profile_id: string | null;
    role: string | null;
    profiles: ProfileRef | ProfileRef[] | null;
  }[];

  const participants: Participant[] = participantRows.map((p) => ({
    id: p.id,
    profileId: p.profile_id,
    name: one(p.profiles)?.name ?? "Unbekannt",
    role: p.role === "organizer" ? "organizer" : "member",
  }));

  // expenses.paid_by zeigt auf profiles, expense_splits auf trip_participants —
  // für den Saldo müssen beide auf dieselbe Achse (participant.id) gebracht werden.
  const participantByProfile = new Map(
    participants.filter((p) => p.profileId).map((p) => [p.profileId!, p.id]),
  );

  const expenses = (trip.expenses ?? []) as {
    id: string;
    amount: number | string;
    paid_by: string | null;
    expense_splits: { participant_id: string | null; share_amount: number | string }[] | null;
  }[];

  const paid = new Map<string, number>();
  const owed = new Map<string, number>();
  let totalSpent = 0;

  for (const expense of expenses) {
    const amount = Number(expense.amount);
    totalSpent += amount;

    const payerId = expense.paid_by
      ? participantByProfile.get(expense.paid_by)
      : undefined;
    if (payerId) paid.set(payerId, (paid.get(payerId) ?? 0) + amount);

    for (const split of expense.expense_splits ?? []) {
      if (!split.participant_id) continue;
      owed.set(
        split.participant_id,
        (owed.get(split.participant_id) ?? 0) + Number(split.share_amount),
      );
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = ((trip.itinerary_items ?? []) as {
    title: string;
    day_date: string;
    start_time: string | null;
    location: string | null;
  }[])
    .filter((i) => i.day_date >= today)
    .sort(
      (a, b) =>
        a.day_date.localeCompare(b.day_date) ||
        (a.start_time ?? "").localeCompare(b.start_time ?? ""),
    )[0];

  return {
    id: trip.id,
    name: trip.name,
    destination: trip.destination,
    startDate: trip.start_date,
    endDate: trip.end_date,
    currency: trip.currency ?? "EUR",
    status: (trip.status ?? "planning") as TripStatus,
    totalSpent,
    participants,
    debts: settleDebts(participants, { paid, owed }),
    nextItem: upcoming
      ? {
          title: upcoming.title,
          dayDate: upcoming.day_date,
          startTime: upcoming.start_time,
          location: upcoming.location,
        }
      : null,
    expenseCount: expenses.length,
  };
}

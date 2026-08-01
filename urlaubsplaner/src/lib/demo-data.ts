import type { TripListItem } from "./types";

// Nur aktiv, solange kein echtes Supabase-Projekt verbunden ist
// (isSupabaseConfigured === false). Die UI kennzeichnet diesen Zustand
// sichtbar als „Demo-Daten", damit er nicht mit echten Trips verwechselt wird.
export const demoTrips: TripListItem[] = [
  {
    id: "demo-lissabon",
    name: "Lissabon",
    destination: "Portugal",
    startDate: "2026-09-12",
    endDate: "2026-09-16",
    currency: "EUR",
    status: "planning",
    totalSpent: 620,
    participantInitials: ["A", "M", "S"],
  },
  {
    id: "demo-dolomiten",
    name: "Wanderwoche Dolomiten",
    destination: "Italien",
    startDate: "2026-07-03",
    endDate: "2026-07-09",
    currency: "EUR",
    status: "completed",
    totalSpent: 940,
    participantInitials: ["A", "T"],
  },
];

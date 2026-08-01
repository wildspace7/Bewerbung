import type { TripDetail, TripListItem } from "./types";

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

export const demoTripDetails: Record<string, TripDetail> = {
  "demo-lissabon": {
    id: "demo-lissabon",
    name: "Lissabon",
    destination: "Portugal",
    startDate: "2026-09-12",
    endDate: "2026-09-16",
    currency: "EUR",
    status: "planning",
    totalSpent: 620,
    expenseCount: 7,
    participants: [
      { id: "p1", profileId: "u1", name: "Anna", role: "organizer" },
      { id: "p2", profileId: "u2", name: "Marco", role: "member" },
      { id: "p3", profileId: "u3", name: "Sofia", role: "member" },
    ],
    debts: [
      { fromName: "Marco", toName: "Anna", amount: 84.5 },
      { fromName: "Sofia", toName: "Anna", amount: 42 },
    ],
    nextItem: {
      title: "Abendessen · Time Out Market",
      dayDate: "2026-09-12",
      startTime: "19:30",
      location: "Mercado da Ribeira",
    },
  },
  "demo-dolomiten": {
    id: "demo-dolomiten",
    name: "Wanderwoche Dolomiten",
    destination: "Italien",
    startDate: "2026-07-03",
    endDate: "2026-07-09",
    currency: "EUR",
    status: "completed",
    totalSpent: 940,
    expenseCount: 12,
    participants: [
      { id: "p4", profileId: "u1", name: "Anna", role: "organizer" },
      { id: "p5", profileId: "u4", name: "Tim", role: "member" },
    ],
    debts: [],
    nextItem: null,
  },
};

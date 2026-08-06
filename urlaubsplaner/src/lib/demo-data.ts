import type {
  DiaryEntry,
  ExpenseListItem,
  ItineraryItem,
  PackingItem,
  TripDetail,
  TripListItem,
} from "./types";

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
    // Muss mit dem chronologisch ersten Eintrag in demoItinerary["demo-lissabon"]
    // übereinstimmen (echte Trips leiten das automatisch aus itinerary_items ab).
    nextItem: {
      title: "Check-in Hotel Alfama",
      dayDate: "2026-09-12",
      startTime: "14:00",
      location: "Alfama",
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

export const demoExpenses: Record<string, ExpenseListItem[]> = {
  "demo-lissabon": [
    {
      id: "e1",
      title: "Abendessen · Time Out Market",
      amount: 42,
      currency: "EUR",
      category: "essen",
      paymentMethod: "karte",
      paidByName: "Anna",
      expenseDate: "2026-09-12",
      splitCount: 3,
    },
    {
      id: "e2",
      title: "Taxi zum Hotel",
      amount: 18,
      currency: "EUR",
      category: "transport",
      paymentMethod: "bargeld",
      paidByName: "Marco",
      expenseDate: "2026-09-12",
      splitCount: 3,
    },
    {
      id: "e3",
      title: "Hotel Alfama, 4 Nächte",
      amount: 480,
      currency: "EUR",
      category: "hotel",
      paymentMethod: "karte",
      paidByName: "Anna",
      expenseDate: "2026-09-12",
      splitCount: 3,
    },
    {
      id: "e4",
      title: "Belém Tower Tickets",
      amount: 30,
      currency: "EUR",
      category: "aktivitaet",
      paymentMethod: "karte",
      paidByName: "Sofia",
      expenseDate: "2026-09-13",
      splitCount: 3,
    },
  ],
  "demo-dolomiten": [
    {
      id: "e5",
      title: "Hütte Übernachtung",
      amount: 860,
      currency: "EUR",
      category: "hotel",
      paymentMethod: "karte",
      paidByName: "Anna",
      expenseDate: "2026-07-03",
      splitCount: 2,
    },
    {
      id: "e6",
      title: "Bergbahn Tickets",
      amount: 80,
      currency: "EUR",
      category: "transport",
      paymentMethod: "bargeld",
      paidByName: "Tim",
      expenseDate: "2026-07-05",
      splitCount: 2,
    },
  ],
};

export const demoItinerary: Record<string, ItineraryItem[]> = {
  "demo-lissabon": [
    {
      id: "i1",
      dayDate: "2026-09-12",
      startTime: "14:00",
      title: "Check-in Hotel Alfama",
      location: "Alfama",
      notes: null,
    },
    {
      id: "i2",
      dayDate: "2026-09-12",
      startTime: "19:30",
      title: "Abendessen · Time Out Market",
      location: "Mercado da Ribeira",
      notes: "Reservierung unter Anna, 19:30 Uhr",
    },
    {
      id: "i3",
      dayDate: "2026-09-13",
      startTime: "10:00",
      title: "Belém Tower & Pastéis de Belém",
      location: "Belém",
      notes: null,
    },
    {
      id: "i4",
      dayDate: "2026-09-14",
      startTime: null,
      title: "Tagesausflug Sintra",
      location: "Sintra",
      notes: "Zug ab Rossio, ca. 40 Min.",
    },
  ],
  "demo-dolomiten": [
    {
      id: "i5",
      dayDate: "2026-07-03",
      startTime: "16:00",
      title: "Ankunft Hütte",
      location: "Rifugio Lagazuoi",
      notes: null,
    },
  ],
};

export const demoPacking: Record<string, PackingItem[]> = {
  "demo-lissabon": [
    { id: "pk1", name: "Reisepass", category: "dokumente", isChecked: true },
    { id: "pk2", name: "Ladekabel", category: "technik", isChecked: false },
    { id: "pk3", name: "Sonnencreme", category: "hygiene", isChecked: false },
    { id: "pk4", name: "Leichte Jacke", category: "kleidung", isChecked: true },
    { id: "pk5", name: "Powerbank", category: "technik", isChecked: false },
  ],
  "demo-dolomiten": [
    { id: "pk6", name: "Wanderschuhe", category: "kleidung", isChecked: true },
    { id: "pk7", name: "Stirnlampe", category: "technik", isChecked: false },
  ],
};

// Platzhalter-"Fotos" als Inline-SVG statt echter Bilder — im Demo-Modus gibt
// es kein Storage-Bucket, und ein externer Bild-Fetch wäre eine unnötige
// Netzwerkabhängigkeit nur für Demozwecke.
function svgPlaceholder(bg: string, emoji: string) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='200' height='200' fill='${bg}'/><text x='50%' y='53%' font-size='72' text-anchor='middle' dominant-baseline='middle'>${emoji}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const demoDiaryEntries: Record<string, DiaryEntry[]> = {
  "demo-lissabon": [
    {
      id: "d1",
      entryDate: "2026-09-12",
      textContent:
        "Angekommen! Das Hotel in der Alfama hat einen Balkon mit Blick auf den Tejo. Abends im Time Out Market gegessen — die Warteschlange war es wert.",
      authorName: "Anna",
      photos: [
        {
          id: "ph1",
          url: svgPlaceholder("#F0865A", "🌅"),
          caption: "Blick vom Balkon",
          isFavorite: true,
        },
        {
          id: "ph2",
          url: svgPlaceholder("#3E93A6", "🍽️"),
          caption: "Time Out Market",
          isFavorite: false,
        },
      ],
    },
  ],
  "demo-dolomiten": [
    {
      id: "d2",
      entryDate: "2026-07-03",
      textContent:
        "Erste Nacht auf der Hütte. Die Wanderung morgen soll knackig werden, aber die Aussicht jetzt schon unbezahlbar.",
      authorName: "Tim",
      photos: [
        {
          id: "ph3",
          url: svgPlaceholder("#8B7FC9", "⛰️"),
          caption: "Rifugio Lagazuoi",
          isFavorite: false,
        },
      ],
    },
  ],
};

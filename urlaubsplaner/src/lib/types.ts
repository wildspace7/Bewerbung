export type TripStatus = "planning" | "active" | "completed";

// Entspricht der `trips`-Tabelle, ergänzt um abgeleitete Anzeige-Werte
// (Teilnehmer-Initialen, Gesamtkosten), die später aus Joins mit
// trip_participants/expenses kommen.
export interface TripListItem {
  id: string;
  name: string;
  destination: string | null;
  startDate: string | null;
  endDate: string | null;
  currency: string;
  status: TripStatus;
  totalSpent: number;
  participantInitials: string[];
}

export interface Participant {
  /** trip_participants.id — Bezugspunkt für expense_splits */
  id: string;
  profileId: string | null;
  name: string;
  role: "organizer" | "member";
}

/** Eine offene Schuld nach Verrechnung aller Ausgaben. */
export interface Debt {
  fromName: string;
  toName: string;
  amount: number;
}

export interface NextItineraryItem {
  title: string;
  dayDate: string;
  startTime: string | null;
  location: string | null;
}

export type ExpenseCategory =
  | "flug"
  | "hotel"
  | "essen"
  | "aktivitaet"
  | "transport"
  | "sonstiges";

export type PaymentMethod = "karte" | "bargeld";

export interface ExpenseListItem {
  id: string;
  title: string;
  amount: number;
  currency: string;
  category: ExpenseCategory | null;
  paymentMethod: PaymentMethod;
  paidByName: string;
  expenseDate: string;
  /** Anzahl Teilnehmer, auf die die Ausgabe aufgeteilt ist. */
  splitCount: number;
}

export interface ItineraryItem {
  id: string;
  dayDate: string;
  startTime: string | null;
  title: string;
  location: string | null;
  notes: string | null;
}

export interface TripDetail {
  id: string;
  name: string;
  destination: string | null;
  startDate: string | null;
  endDate: string | null;
  currency: string;
  status: TripStatus;
  totalSpent: number;
  participants: Participant[];
  debts: Debt[];
  nextItem: NextItineraryItem | null;
  expenseCount: number;
}

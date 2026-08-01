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

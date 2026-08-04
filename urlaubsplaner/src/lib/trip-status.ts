import type { TripStatus } from "./types";

export const tripStatusLabels: Record<TripStatus, string> = {
  planning: "Planung",
  active: "Aktiv",
  completed: "Abgeschlossen",
};

export const tripStatusOptions: { value: TripStatus; label: string }[] = (
  Object.entries(tripStatusLabels) as [TripStatus, string][]
).map(([value, label]) => ({ value, label }));

/** Kleine, feste Auswahl statt freiem Text — deckt die gängigen Reisewährungen ab. */
export const currencyOptions = ["EUR", "USD", "GBP", "CHF"];

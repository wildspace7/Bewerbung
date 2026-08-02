/**
 * Teilt einen Betrag zu gleichen Teilen auf `count` Personen auf, Cent-genau.
 * Der Rundungsrest aus der Division geht an die erste Person, damit die
 * Summe der Anteile exakt dem Gesamtbetrag entspricht.
 */
export function splitEqually(amount: number, count: number): number[] {
  if (count <= 0) return [];

  const base = Math.floor((amount / count) * 100) / 100;
  const remainder = Math.round((amount - base * count) * 100) / 100;

  return Array.from({ length: count }, (_, i) =>
    i === 0 ? Math.round((base + remainder) * 100) / 100 : base,
  );
}

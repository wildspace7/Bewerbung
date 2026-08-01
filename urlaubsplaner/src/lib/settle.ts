import type { Debt, Participant } from "./types";

export interface BalanceInput {
  /** Was diese Person ausgelegt hat (expenses.paid_by). */
  paid: Map<string, number>;
  /** Was auf diese Person entfällt (Summe der expense_splits). */
  owed: Map<string, number>;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Verrechnet alle Ausgaben zu möglichst wenigen Zahlungen.
 *
 * Saldo je Teilnehmer:in = ausgelegt − eigener Anteil. Positiv heißt „bekommt
 * Geld", negativ „schuldet Geld". Danach werden die größten Schuldner den
 * größten Gläubigern zugeordnet, bis alles ausgeglichen ist — das ergibt
 * weniger Überweisungen als jede Ausgabe einzeln zurückzuzahlen.
 */
export function settleDebts(
  participants: Participant[],
  { paid, owed }: BalanceInput,
): Debt[] {
  const balances = participants.map((p) => ({
    name: p.name,
    balance: round2((paid.get(p.id) ?? 0) - (owed.get(p.id) ?? 0)),
  }));

  const creditors = balances
    .filter((b) => b.balance > 0)
    .sort((a, b) => b.balance - a.balance);
  const debtors = balances
    .filter((b) => b.balance < 0)
    .map((b) => ({ ...b, balance: -b.balance }))
    .sort((a, b) => b.balance - a.balance);

  const debts: Debt[] = [];
  let ci = 0;
  let di = 0;

  // Cent-Beträge unter 1 Cent gelten als ausgeglichen (Rundungsreste).
  while (ci < creditors.length && di < debtors.length) {
    const amount = round2(Math.min(creditors[ci].balance, debtors[di].balance));

    if (amount >= 0.01) {
      debts.push({
        fromName: debtors[di].name,
        toName: creditors[ci].name,
        amount,
      });
    }

    creditors[ci].balance = round2(creditors[ci].balance - amount);
    debtors[di].balance = round2(debtors[di].balance - amount);

    if (creditors[ci].balance < 0.01) ci++;
    if (debtors[di].balance < 0.01) di++;
  }

  return debts;
}

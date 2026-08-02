"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/BackButton";
import { Field, SelectField } from "@/components/FormField";
import { expenseCategories, paymentMethods } from "@/lib/expense-categories";
import { splitEqually } from "@/lib/split-equally";
import { createClient } from "@/lib/supabase/client";
import type { Participant } from "@/lib/types";

export function NewExpenseForm({
  tripId,
  currency,
  participants,
}: {
  tripId: string;
  currency: string;
  participants: Participant[];
}) {
  const router = useRouter();
  const backHref = `/trips/${tripId}/ausgaben`;

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(expenseCategories[0].value);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].value);
  const [paidBy, setPaidBy] = useState(participants[0]?.profileId ?? "");
  const [expenseDate, setExpenseDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const parsedAmount = Number(amount.replace(",", "."));
  const shares =
    parsedAmount > 0 ? splitEqually(parsedAmount, participants.length) : [];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (participants.length === 0) {
      setError("Der Trip hat noch keine Teilnehmer:innen.");
      return;
    }
    if (!paidBy) {
      setError("Bitte auswählen, wer bezahlt hat.");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();

    const { data: expense, error: insertError } = await supabase
      .from("expenses")
      .insert({
        trip_id: tripId,
        title,
        amount: parsedAmount,
        category,
        payment_method: paymentMethod,
        paid_by: paidBy,
        expense_date: expenseDate,
      })
      .select("id")
      .single();

    if (insertError) {
      setSubmitting(false);
      setError(insertError.message);
      return;
    }

    const { error: splitsError } = await supabase.from("expense_splits").insert(
      participants.map((p, i) => ({
        expense_id: expense.id,
        participant_id: p.id,
        share_amount: shares[i],
      })),
    );

    setSubmitting(false);

    if (splitsError) {
      setError(splitsError.message);
      return;
    }

    router.push(backHref);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <BackButton href={backHref} />
        <h2 className="text-h2 text-ink">Ausgabe hinzufügen</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-xl border border-white/75 bg-white/65 p-6 shadow-[0_20px_40px_-18px_rgba(90,100,150,0.35)] backdrop-blur-[18px]"
      >
        <Field
          label="Titel"
          required
          placeholder="z. B. Abendessen"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="flex gap-3">
          <Field
            label={`Betrag (${currency})`}
            required
            inputMode="decimal"
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Field
            label="Datum"
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <SelectField
            label="Kategorie"
            value={category}
            onChange={(e) => setCategory(e.target.value as typeof category)}
          >
            {expenseCategories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.icon} {c.label}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Zahlungsart"
            value={paymentMethod}
            onChange={(e) =>
              setPaymentMethod(e.target.value as typeof paymentMethod)
            }
          >
            {paymentMethods.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </SelectField>
        </div>

        <SelectField
          label="Bezahlt von"
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
        >
          {participants.map((p) => (
            <option key={p.id} value={p.profileId ?? ""}>
              {p.name}
            </option>
          ))}
        </SelectField>

        {parsedAmount > 0 && participants.length > 0 && (
          <p className="text-body-sm text-ink-soft">
            Wird zu gleichen Teilen auf {participants.length}{" "}
            {participants.length === 1 ? "Person" : "Personen"} aufgeteilt —
            je ca. {(parsedAmount / participants.length).toFixed(2)}{" "}
            {currency}.
          </p>
        )}

        {error && <p className="text-body-sm text-coral-deep">{error}</p>}

        <button
          type="submit"
          disabled={submitting || !title || !(parsedAmount > 0)}
          className="mt-2 flex items-center justify-center gap-2 rounded-md bg-gradient-to-br from-coral to-coral-deep px-6 py-3.5 text-button text-white shadow-[0_12px_24px_-8px_rgba(224,106,62,0.55)] disabled:opacity-50"
        >
          {submitting ? "Wird gespeichert…" : "Ausgabe speichern"}
        </button>
      </form>
    </div>
  );
}

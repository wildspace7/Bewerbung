"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Field, SelectField } from "@/components/FormField";
import { createClient } from "@/lib/supabase/client";
import { currencyOptions, tripStatusOptions } from "@/lib/trip-status";
import type { TripDetail } from "@/lib/types";

export function TripSettingsForm({
  trip,
  isOrganizer,
}: {
  trip: TripDetail;
  isOrganizer: boolean;
}) {
  const router = useRouter();

  const [name, setName] = useState(trip.name);
  const [destination, setDestination] = useState(trip.destination ?? "");
  const [startDate, setStartDate] = useState(trip.startDate ?? "");
  const [endDate, setEndDate] = useState(trip.endDate ?? "");
  const [currency, setCurrency] = useState(trip.currency);
  const [status, setStatus] = useState(trip.status);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setSaving(true);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("trips")
      .update({
        name,
        destination: destination || null,
        start_date: startDate || null,
        end_date: endDate || null,
        currency,
        status,
      })
      .eq("id", trip.id);

    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSaved(true);
    router.refresh();
  }

  async function handleDelete() {
    if (
      !window.confirm(
        `„${trip.name}" wirklich löschen? Das entfernt alle Ausgaben, Termine und weiteren Daten unwiderruflich.`,
      )
    )
      return;

    setDeleting(true);
    setError(null);

    const supabase = createClient();
    const { error: deleteError } = await supabase
      .from("trips")
      .delete()
      .eq("id", trip.id);

    if (deleteError) {
      setDeleting(false);
      setError(deleteError.message);
      return;
    }

    router.push("/trips");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-xl border border-white/75 bg-white/65 p-6 shadow-[0_20px_40px_-18px_rgba(90,100,150,0.35)] backdrop-blur-[18px]"
      >
        <Field
          label="Reisename"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Field
          label="Ziel"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <div className="flex gap-3">
          <Field
            label="Start"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Field
            label="Ende"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <SelectField
            label="Währung"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            {currencyOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
          >
            {tripStatusOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </SelectField>
        </div>

        {error && <p className="text-body-sm text-coral-deep">{error}</p>}
        {saved && !error && (
          <p className="text-body-sm font-bold text-teal">Gespeichert ✓</p>
        )}

        <button
          type="submit"
          disabled={saving || !name}
          className="mt-2 flex items-center justify-center gap-2 rounded-md bg-gradient-to-br from-coral to-coral-deep px-6 py-3.5 text-button text-white shadow-[0_12px_24px_-8px_rgba(224,106,62,0.55)] disabled:opacity-50"
        >
          {saving ? "Wird gespeichert…" : "Änderungen speichern"}
        </button>
      </form>

      {isOrganizer && (
        <section className="rounded-xl border border-coral-deep/30 bg-white/50 p-6 backdrop-blur-[18px]">
          <h2 className="text-label uppercase text-coral-deep">Gefahrenzone</h2>
          <p className="mt-2 text-body-sm text-ink-soft">
            Löscht den Trip endgültig, inklusive aller Ausgaben, Termine,
            Packliste und Tagebucheinträge.
          </p>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="mt-4 rounded-md border border-coral-deep px-5 py-2.5 text-button text-coral-deep disabled:opacity-50"
          >
            {deleting ? "Wird gelöscht…" : "Trip löschen"}
          </button>
        </section>
      )}
    </div>
  );
}

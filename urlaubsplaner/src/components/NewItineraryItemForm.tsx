"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/BackButton";
import { Field } from "@/components/FormField";
import { createClient } from "@/lib/supabase/client";

export function NewItineraryItemForm({ tripId }: { tripId: string }) {
  const router = useRouter();
  const backHref = `/trips/${tripId}/terminplan`;

  const [title, setTitle] = useState("");
  const [dayDate, setDayDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const supabase = createClient();
    const { error: insertError } = await supabase.from("itinerary_items").insert({
      trip_id: tripId,
      day_date: dayDate,
      start_time: startTime || null,
      title,
      location: location || null,
      notes: notes || null,
    });

    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.push(backHref);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <BackButton href={backHref} />
        <h2 className="text-h2 text-ink">Termin hinzufügen</h2>
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
            label="Datum"
            type="date"
            required
            value={dayDate}
            onChange={(e) => setDayDate(e.target.value)}
          />
          <Field
            label="Uhrzeit"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <Field
          label="Ort"
          placeholder="z. B. Mercado da Ribeira"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <Field
          label="Notizen"
          placeholder="optional"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {error && <p className="text-body-sm text-coral-deep">{error}</p>}

        <button
          type="submit"
          disabled={submitting || !title || !dayDate}
          className="mt-2 flex items-center justify-center gap-2 rounded-md bg-gradient-to-br from-coral to-coral-deep px-6 py-3.5 text-button text-white shadow-[0_12px_24px_-8px_rgba(224,106,62,0.55)] disabled:opacity-50"
        >
          {submitting ? "Wird gespeichert…" : "Termin speichern"}
        </button>
      </form>
    </div>
  );
}

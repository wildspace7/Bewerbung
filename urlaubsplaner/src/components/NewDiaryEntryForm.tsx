"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/BackButton";
import { Field } from "@/components/FormField";
import { createClient } from "@/lib/supabase/client";

export function NewDiaryEntryForm({ tripId }: { tripId: string }) {
  const router = useRouter();
  const backHref = `/trips/${tripId}/tagebuch`;

  const [entryDate, setEntryDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [textContent, setTextContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error: insertError } = await supabase.from("diary_entries").insert({
      trip_id: tripId,
      entry_date: entryDate,
      text_content: textContent || null,
      created_by: user?.id ?? null,
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
        <h2 className="text-h2 text-ink">Eintrag hinzufügen</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-xl border border-white/75 bg-white/65 p-6 shadow-[0_20px_40px_-18px_rgba(90,100,150,0.35)] backdrop-blur-[18px]"
      >
        <Field
          label="Datum"
          type="date"
          required
          value={entryDate}
          onChange={(e) => setEntryDate(e.target.value)}
        />

        <label className="block">
          <span className="text-label uppercase text-ink-faint">
            Was ist heute passiert?
          </span>
          <textarea
            required
            rows={6}
            placeholder="Erzähl von eurem Tag …"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            className="mt-1.5 w-full resize-none rounded-md border border-white/75 bg-white/42 px-4 py-3 text-body text-ink placeholder:text-ink-faint backdrop-blur-[14px] outline-none transition-colors focus:border-coral"
          />
        </label>

        {error && <p className="text-body-sm text-coral-deep">{error}</p>}

        <button
          type="submit"
          disabled={submitting || !textContent || !entryDate}
          className="mt-2 flex items-center justify-center gap-2 rounded-md bg-gradient-to-br from-coral to-coral-deep px-6 py-3.5 text-button text-white shadow-[0_12px_24px_-8px_rgba(224,106,62,0.55)] disabled:opacity-50"
        >
          {submitting ? "Wird gespeichert…" : "Eintrag speichern"}
        </button>
      </form>
    </div>
  );
}

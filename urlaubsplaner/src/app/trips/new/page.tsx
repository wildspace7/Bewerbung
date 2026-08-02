"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AmbientBackground } from "@/components/AmbientBackground";
import { BackButton } from "@/components/BackButton";
import { Field } from "@/components/FormField";
import { createClient } from "@/lib/supabase/client";

export default function NewTripPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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

    const { data: trip, error: insertError } = await supabase
      .from("trips")
      .insert({
        name,
        destination: destination || null,
        start_date: startDate || null,
        end_date: endDate || null,
        created_by: user?.id ?? null,
      })
      .select("id")
      .single();

    if (insertError) {
      setSubmitting(false);
      setError(insertError.message);
      return;
    }

    // Wer den Trip anlegt, ist automatisch Organisator.
    if (user) {
      await supabase.from("trip_participants").insert({
        trip_id: trip.id,
        profile_id: user.id,
        role: "organizer",
      });
    }

    setSubmitting(false);
    router.push(`/trips/${trip.id}`);
    router.refresh();
  }

  return (
    <>
      <AmbientBackground />
      <div className="mx-auto flex min-h-screen w-full max-w-lg flex-1 flex-col px-5 py-8">
        <header className="flex items-center gap-3">
          <BackButton href="/trips" />
          <h1 className="text-h2 text-ink">Neuer Urlaub</h1>
        </header>

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-4 rounded-xl border border-white/75 bg-white/65 p-6 shadow-[0_20px_40px_-18px_rgba(90,100,150,0.35)] backdrop-blur-[18px]"
        >
          <Field
            label="Reisename"
            required
            placeholder="z. B. Lissabon"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Field
            label="Ziel"
            placeholder="z. B. Portugal"
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

          {error && <p className="text-body-sm text-coral-deep">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !name}
            className="mt-2 flex items-center justify-center gap-2 rounded-md bg-gradient-to-br from-coral to-coral-deep px-6 py-3.5 text-button text-white shadow-[0_12px_24px_-8px_rgba(224,106,62,0.55)] disabled:opacity-50"
          >
            {submitting ? "Wird angelegt…" : "Urlaub anlegen"}
          </button>
        </form>
      </div>
    </>
  );
}

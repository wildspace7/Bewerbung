"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { AmbientBackground } from "@/components/AmbientBackground";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/trips";

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
      },
    });

    setSubmitting(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-coral to-coral-deep shadow-[0_12px_24px_-8px_rgba(224,106,62,0.55)]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7"
          >
            <path d="M4 6h16v12H4z" />
            <path d="M4 7l8 6 8-6" />
          </svg>
        </div>
        <h2 className="mt-5 text-h2 text-ink">Link ist unterwegs</h2>
        <p className="mt-2 text-body text-ink-soft">
          Wir haben dir einen Anmelde-Link an <strong>{email}</strong> geschickt.
          Öffne ihn auf diesem Gerät, um loszulegen.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-6 text-button text-ink-soft"
        >
          Andere E-Mail verwenden
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-h2 text-ink">Willkommen zurück</h1>
      <p className="mt-2 text-body text-ink-soft">
        Melde dich mit deiner E-Mail an — wir schicken dir einen Link, kein
        Passwort nötig.
      </p>

      <label className="mt-6 block">
        <span className="text-label uppercase text-ink-faint">E-Mail</span>
        <input
          type="email"
          required
          placeholder="du@beispiel.de"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5 w-full rounded-md border border-white/75 bg-white/42 px-4 py-3 text-body text-ink placeholder:text-ink-faint backdrop-blur-[14px] outline-none transition-colors focus:border-coral"
        />
      </label>

      {error && <p className="mt-3 text-body-sm text-coral-deep">{error}</p>}

      <button
        type="submit"
        disabled={submitting || !email}
        className="mt-5 w-full rounded-md bg-gradient-to-br from-coral to-coral-deep px-6 py-3.5 text-button text-white shadow-[0_12px_24px_-8px_rgba(224,106,62,0.55)] disabled:opacity-50"
      >
        {submitting ? "Wird gesendet…" : "Anmelde-Link schicken"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <>
      <AmbientBackground />
      <div className="mx-auto flex min-h-screen w-full max-w-lg flex-1 flex-col justify-center px-5 py-8">
        <p className="mb-3 text-label uppercase text-ink-faint">Urlaubsplaner</p>
        <div className="rounded-xl border border-white/75 bg-white/65 p-7 shadow-[0_20px_40px_-18px_rgba(90,100,150,0.35)] backdrop-blur-[18px]">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </>
  );
}

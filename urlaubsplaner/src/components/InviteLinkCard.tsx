"use client";

import { useState } from "react";

export function InviteLinkCard({ tripId }: { tripId: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const link = `${window.location.origin}/trips/${tripId}/join`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="rounded-xl border border-white/75 bg-white/65 p-5 shadow-[0_20px_40px_-18px_rgba(90,100,150,0.35)] backdrop-blur-[18px]">
      <h2 className="text-label uppercase text-ink-faint">Einladungslink</h2>
      <p className="mt-2 text-body-sm text-ink-soft">
        Wer diesen Link öffnet und sich anmeldet, ist automatisch Mitreisende:r
        bei diesem Trip.
      </p>
      <button
        onClick={handleCopy}
        className="mt-4 w-full rounded-md bg-gradient-to-br from-coral to-coral-deep px-6 py-3 text-button text-white shadow-[0_12px_24px_-8px_rgba(224,106,62,0.55)]"
      >
        {copied ? "Link kopiert ✓" : "Link kopieren"}
      </button>
    </section>
  );
}

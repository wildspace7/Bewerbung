"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LeaveTripButton({ participantId }: { participantId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);

  async function handleLeave() {
    if (!window.confirm("Diesen Trip wirklich verlassen?")) return;

    setLeaving(true);
    setError(null);

    const supabase = createClient();
    const { error: deleteError } = await supabase
      .from("trip_participants")
      .delete()
      .eq("id", participantId);

    if (deleteError) {
      setLeaving(false);
      setError(deleteError.message);
      return;
    }

    router.push("/trips");
    router.refresh();
  }

  return (
    <div>
      <button
        onClick={handleLeave}
        disabled={leaving}
        className="text-body-sm font-bold text-coral-deep disabled:opacity-50"
      >
        {leaving ? "Verlasse Trip…" : "Trip verlassen"}
      </button>
      {error && <p className="mt-1 text-body-sm text-coral-deep">{error}</p>}
    </div>
  );
}

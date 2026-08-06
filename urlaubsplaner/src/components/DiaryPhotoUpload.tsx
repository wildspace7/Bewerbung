"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function DiaryPhotoUpload({
  tripId,
  entryId,
}: {
  tripId: string;
  entryId: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setError(null);

    const supabase = createClient();
    const path = `${tripId}/diary/${entryId}/${crypto.randomUUID()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("trip-files")
      .upload(path, file);

    if (uploadError) {
      setUploading(false);
      setError(uploadError.message);
      return;
    }

    const { error: insertError } = await supabase.from("diary_photos").insert({
      diary_entry_id: entryId,
      photo_url: path,
    });

    setUploading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.refresh();
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="text-body-sm font-bold text-coral-deep disabled:opacity-50"
      >
        {uploading ? "Wird hochgeladen…" : "+ Foto"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      {error && <p className="mt-1 text-body-sm text-coral-deep">{error}</p>}
    </div>
  );
}

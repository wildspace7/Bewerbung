import Link from "next/link";
import { DiaryPhotoUpload } from "@/components/DiaryPhotoUpload";
import { formatDay } from "@/lib/format";
import { getDiaryEntries } from "@/lib/diary";

export default async function TagebuchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { entries } = await getDiaryEntries(id);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-body-sm text-ink-soft">
          {entries.length === 0
            ? "Noch keine Einträge"
            : `${entries.length} ${entries.length === 1 ? "Eintrag" : "Einträge"}`}
        </p>
        <Link
          href={`/trips/${id}/tagebuch/new`}
          className="flex items-center gap-1.5 rounded-md bg-gradient-to-br from-coral to-coral-deep px-4 py-2 text-button text-white shadow-[0_12px_24px_-8px_rgba(224,106,62,0.55)]"
        >
          + Eintrag
        </Link>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-xl border border-white/75 bg-white/65 p-8 text-center shadow-[0_20px_40px_-18px_rgba(90,100,150,0.35)] backdrop-blur-[18px]">
          <p className="text-body text-ink-soft">
            Halt den ersten Moment eurer Reise fest.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="rounded-xl border border-white/75 bg-white/65 p-5 shadow-[0_20px_40px_-18px_rgba(90,100,150,0.35)] backdrop-blur-[18px]"
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-h3 text-ink">{formatDay(entry.entryDate)}</p>
                <p className="text-body-sm text-ink-faint">
                  {entry.authorName}
                </p>
              </div>
              {entry.textContent && (
                <p className="mt-2 whitespace-pre-wrap text-body text-ink-soft">
                  {entry.textContent}
                </p>
              )}

              {entry.photos.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {entry.photos.map((photo) => (
                    // eslint-disable-next-line @next/next/no-img-element -- Signed URLs sind kurzlebig, next/image-Optimierung/Caching lohnt hier nicht.
                    <img
                      key={photo.id}
                      src={photo.url}
                      alt={photo.caption ?? ""}
                      className="h-20 w-20 rounded-md object-cover"
                    />
                  ))}
                </div>
              )}

              <DiaryPhotoUpload tripId={id} entryId={entry.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

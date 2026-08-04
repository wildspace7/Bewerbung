import Link from "next/link";
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
            Halt den ersten Moment eurer Reise fest. Fotos zu Einträgen folgen
            in einer späteren Version.
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

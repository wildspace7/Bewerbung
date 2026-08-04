import Link from "next/link";
import { formatDay } from "@/lib/format";
import { getItinerary, groupByDay } from "@/lib/itinerary";

export default async function TerminplanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { items } = await getItinerary(id);
  const days = groupByDay(items);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-body-sm text-ink-soft">
          {items.length === 0
            ? "Noch keine Termine"
            : `${items.length} ${items.length === 1 ? "Termin" : "Termine"}`}
        </p>
        <Link
          href={`/trips/${id}/terminplan/new`}
          className="flex items-center gap-1.5 rounded-md bg-gradient-to-br from-coral to-coral-deep px-4 py-2 text-button text-white shadow-[0_12px_24px_-8px_rgba(224,106,62,0.55)]"
        >
          + Termin
        </Link>
      </div>

      {days.length === 0 ? (
        <div className="rounded-xl border border-white/75 bg-white/65 p-8 text-center shadow-[0_20px_40px_-18px_rgba(90,100,150,0.35)] backdrop-blur-[18px]">
          <p className="text-body text-ink-soft">
            Trag den ersten Programmpunkt ein, um den Terminplan zu starten.
          </p>
        </div>
      ) : (
        days.map(([dayDate, dayItems]) => (
          <section key={dayDate}>
            <h2 className="text-label uppercase text-ink-faint">
              {formatDay(dayDate)}
            </h2>
            <ul className="mt-2 flex flex-col gap-3">
              {dayItems.map((item) => (
                <li
                  key={item.id}
                  className="rounded-lg border border-white/75 bg-white/65 p-4 shadow-[0_20px_40px_-18px_rgba(90,100,150,0.35)] backdrop-blur-[18px]"
                >
                  <div className="flex items-baseline gap-2">
                    {item.startTime && (
                      <span className="text-body-sm font-bold text-coral-deep">
                        {item.startTime.slice(0, 5)}
                      </span>
                    )}
                    <p className="text-body font-bold text-ink">
                      {item.title}
                    </p>
                  </div>
                  {item.location && (
                    <p className="mt-0.5 text-body-sm text-ink-soft">
                      {item.location}
                    </p>
                  )}
                  {item.notes && (
                    <p className="mt-1.5 text-body-sm text-ink-faint">
                      {item.notes}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { getTripDetail } from "@/lib/trip-detail";
import { formatDay, formatMoney } from "@/lib/format";

function Card({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-white/75 bg-white/65 p-5 shadow-[0_20px_40px_-18px_rgba(90,100,150,0.35)] backdrop-blur-[18px]">
      <h2 className="text-label uppercase text-ink-faint">{label}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default async function TripDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trip = await getTripDetail(id);

  if (!trip) notFound();

  return (
    <div className="flex flex-col gap-4">
      <Card label="Gesamtkosten">
        <div className="flex items-baseline justify-between">
          <span className="text-display text-ink">
            {formatMoney(trip.totalSpent, trip.currency)}
          </span>
          <span className="text-body-sm text-ink-soft">
            {trip.expenseCount === 0
              ? "noch keine Ausgaben"
              : `${trip.expenseCount} ${trip.expenseCount === 1 ? "Ausgabe" : "Ausgaben"}`}
          </span>
        </div>
        {trip.participants.length > 0 && trip.totalSpent > 0 && (
          <p className="mt-2 text-body-sm text-ink-soft">
            {formatMoney(
              trip.totalSpent / trip.participants.length,
              trip.currency,
            )}{" "}
            pro Person bei {trip.participants.length} Mitreisenden
          </p>
        )}
        <Link
          href={`/trips/${trip.id}/ausgaben`}
          className="mt-3 inline-block text-body-sm font-bold text-coral-deep"
        >
          Alle Ausgaben ansehen →
        </Link>
      </Card>

      <Card label="Nächster Termin">
        {trip.nextItem ? (
          <>
            <p className="text-h3 text-ink">{trip.nextItem.title}</p>
            <p className="mt-1 text-body-sm text-ink-soft">
              {formatDay(trip.nextItem.dayDate)}
              {trip.nextItem.startTime &&
                ` · ${trip.nextItem.startTime.slice(0, 5)} Uhr`}
              {trip.nextItem.location && ` · ${trip.nextItem.location}`}
            </p>
          </>
        ) : (
          <p className="text-body text-ink-soft">
            Kein Termin geplant — der Terminplan kommt in Phase 2.
          </p>
        )}
      </Card>

      <Card label="Wer schuldet wem">
        {trip.debts.length === 0 ? (
          <p className="text-body text-ink-soft">
            {trip.totalSpent === 0
              ? "Sobald Ausgaben eingetragen sind, steht hier die Aufteilung."
              : "Alles ausgeglichen — niemand schuldet jemandem etwas."}
          </p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {trip.debts.map((debt, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-3 text-body"
              >
                <span className="text-ink">
                  <strong className="font-bold">{debt.fromName}</strong>
                  <span className="text-ink-faint"> schuldet </span>
                  <strong className="font-bold">{debt.toName}</strong>
                </span>
                <span className="whitespace-nowrap font-bold text-coral-deep">
                  {formatMoney(debt.amount, trip.currency)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card label={`Mitreisende · ${trip.participants.length}`}>
        {trip.participants.length === 0 ? (
          <p className="text-body text-ink-soft">
            Noch niemand eingeladen.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {trip.participants.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-2 rounded-xs border border-white/75 bg-white/42 px-3 py-1.5 backdrop-blur-[14px]"
              >
                <span className="text-body-sm text-ink">{p.name}</span>
                {p.role === "organizer" && (
                  <span className="text-label uppercase text-coral-deep">
                    Organisator
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
        <Link
          href={`/trips/${trip.id}/teilnehmer`}
          className="mt-3 inline-block text-body-sm font-bold text-coral-deep"
        >
          Teilnehmer verwalten / einladen →
        </Link>
      </Card>
    </div>
  );
}

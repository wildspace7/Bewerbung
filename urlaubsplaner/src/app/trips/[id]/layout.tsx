import Link from "next/link";
import { notFound } from "next/navigation";
import { AmbientBackground } from "@/components/AmbientBackground";
import { TripTabs } from "@/components/TripTabs";
import { getTripDetail } from "@/lib/trip-detail";
import { formatDateRange } from "@/lib/format";

// Der Hub-Rahmen: Kopfbereich und Tab-Navigation bleiben über alle
// Kind-Screens hinweg stehen, nur der Inhalt darunter wechselt.
export default async function TripLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trip = await getTripDetail(id);

  if (!trip) notFound();

  return (
    <>
      <AmbientBackground />
      <div className="mx-auto flex min-h-screen w-full max-w-lg flex-1 flex-col px-5 py-8">
        <header>
          <div className="flex items-start gap-3">
            <Link
              href="/trips"
              aria-label="Zurück zur Trip-Liste"
              className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-white/75 bg-white/42 shadow-[0_4px_14px_rgba(80,90,140,0.12)] backdrop-blur-[14px]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-ink"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </Link>
            <div className="min-w-0">
              <p className="text-label uppercase text-ink-faint">
                {trip.destination ?? "Reiseziel offen"}
              </p>
              <h1 className="text-h2 text-ink">{trip.name}</h1>
              <p className="mt-0.5 text-body-sm text-ink-soft">
                {formatDateRange(trip.startDate, trip.endDate)}
              </p>
            </div>
          </div>

          <TripTabs tripId={trip.id} />
        </header>

        <main className="mt-6 flex flex-1 flex-col">{children}</main>
      </div>
    </>
  );
}

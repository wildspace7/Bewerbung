import { notFound } from "next/navigation";
import { AmbientBackground } from "@/components/AmbientBackground";
import { BackButton } from "@/components/BackButton";
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
            <div className="mt-1">
              <BackButton href="/trips" />
            </div>
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

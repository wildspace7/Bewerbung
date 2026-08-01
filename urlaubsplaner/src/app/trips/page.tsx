import Link from "next/link";
import { AmbientBackground } from "@/components/AmbientBackground";
import { EmptyTripsState } from "@/components/EmptyTripsState";
import { TripCard } from "@/components/TripCard";
import { getTrips } from "@/lib/trips";

function AddTripButton() {
  return (
    <Link
      href="/trips/new"
      aria-label="Neuen Urlaub anlegen"
      className="flex h-10 w-10 items-center justify-center rounded-sm border border-white/75 bg-white/42 shadow-[0_4px_14px_rgba(80,90,140,0.12)] backdrop-blur-[14px]"
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
        <path d="M12 5v14M5 12h14" />
      </svg>
    </Link>
  );
}

export default async function TripsPage() {
  const { trips, isDemo } = await getTrips();

  return (
    <>
      <AmbientBackground />
      <div className="mx-auto flex min-h-screen w-full max-w-lg flex-1 flex-col px-5 py-8">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-label uppercase text-ink-faint">Urlaubsplaner</p>
            <h1 className="text-h2 text-ink">Deine Urlaube</h1>
          </div>
          <AddTripButton />
        </header>

        {isDemo && (
          <p className="mt-4 rounded-xs border border-white/75 bg-white/42 px-3 py-2 text-body-sm text-ink-soft backdrop-blur-[14px]">
            Demo-Daten — es ist noch kein Supabase-Projekt verbunden.
          </p>
        )}

        <main className="mt-6 flex flex-1 flex-col">
          {trips.length === 0 ? (
            <EmptyTripsState />
          ) : (
            <ul className="flex flex-col gap-4">
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </ul>
          )}
        </main>
      </div>
    </>
  );
}

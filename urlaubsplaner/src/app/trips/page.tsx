import Link from "next/link";
import { AmbientBackground } from "@/components/AmbientBackground";
import { EmptyTripsState } from "@/components/EmptyTripsState";
import { TripCard } from "@/components/TripCard";
import type { TripListItem } from "@/lib/types";

// TODO: durch echte Supabase-Query ersetzen, sobald Auth/Trips angebunden sind.
const mockTrips: TripListItem[] = [
  {
    id: "1",
    name: "Lissabon",
    destination: "Portugal",
    startDate: "2026-09-12",
    endDate: "2026-09-16",
    currency: "EUR",
    status: "planning",
    totalSpent: 620,
    participantInitials: ["A", "M", "S"],
  },
  {
    id: "2",
    name: "Wanderwoche Dolomiten",
    destination: "Italien",
    startDate: "2026-07-03",
    endDate: "2026-07-09",
    currency: "EUR",
    status: "completed",
    totalSpent: 940,
    participantInitials: ["A", "T"],
  },
];

function AddTripButton() {
  return (
    <Link
      href="/trips/new"
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

export default function TripsPage() {
  const trips = mockTrips;

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

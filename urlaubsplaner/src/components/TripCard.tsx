import Link from "next/link";
import { formatDateRange, formatMoney } from "@/lib/format";
import type { TripListItem } from "@/lib/types";

const avatarColors = ["bg-coral", "bg-teal", "bg-ink-soft"];

const statusLabels: Record<TripListItem["status"], string> = {
  planning: "Planung",
  active: "Aktiv",
  completed: "Abgeschlossen",
};

export function TripCard({ trip }: { trip: TripListItem }) {
  return (
    <li>
      <Link
        href={`/trips/${trip.id}`}
        className="block rounded-xl border border-white/75 bg-white/65 p-5 shadow-[0_20px_40px_-18px_rgba(90,100,150,0.35)] backdrop-blur-[18px] transition hover:bg-white/75"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-h3 text-ink">{trip.name}</h3>
            <p className="mt-1 text-body-sm text-ink-soft">
              {formatDateRange(trip.startDate, trip.endDate)}
            </p>
          </div>
          <span className="text-h3 whitespace-nowrap text-ink">
            {trip.totalSpent > 0
              ? formatMoney(trip.totalSpent, trip.currency)
              : "–"}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex -space-x-2">
            {trip.participantInitials.map((initials, i) => (
              <span
                key={initials + i}
                className={`${avatarColors[i % avatarColors.length]} flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-label text-white`}
              >
                {initials}
              </span>
            ))}
          </div>
          <span className="rounded-xs bg-ink/5 px-2.5 py-1 text-label uppercase text-ink-faint">
            {statusLabels[trip.status]}
          </span>
        </div>
      </Link>
    </li>
  );
}

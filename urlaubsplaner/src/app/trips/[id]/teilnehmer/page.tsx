import { notFound } from "next/navigation";
import { InviteLinkCard } from "@/components/InviteLinkCard";
import { LeaveTripButton } from "@/components/LeaveTripButton";
import { getCurrentProfileId } from "@/lib/current-user";
import { getTripDetail } from "@/lib/trip-detail";

export default async function TeilnehmerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [trip, currentProfileId] = await Promise.all([
    getTripDetail(id),
    getCurrentProfileId(),
  ]);

  if (!trip) notFound();

  const me = trip.participants.find((p) => p.profileId === currentProfileId);

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-xl border border-white/75 bg-white/65 p-5 shadow-[0_20px_40px_-18px_rgba(90,100,150,0.35)] backdrop-blur-[18px]">
        <h2 className="text-label uppercase text-ink-faint">
          Mitreisende · {trip.participants.length}
        </h2>
        <ul className="mt-3 flex flex-col gap-2.5">
          {trip.participants.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-white/60 bg-white/40 px-4 py-2.5"
            >
              <span className="text-body text-ink">
                {p.name}
                {p.profileId === currentProfileId && (
                  <span className="text-ink-faint"> (du)</span>
                )}
              </span>
              {p.role === "organizer" && (
                <span className="text-label uppercase text-coral-deep">
                  Organisator
                </span>
              )}
            </li>
          ))}
        </ul>

        {me && me.role !== "organizer" && (
          <div className="mt-4">
            <LeaveTripButton participantId={me.id} />
          </div>
        )}
      </section>

      <InviteLinkCard tripId={trip.id} />
    </div>
  );
}

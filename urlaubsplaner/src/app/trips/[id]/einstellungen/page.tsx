import { notFound } from "next/navigation";
import { TripSettingsForm } from "@/components/TripSettingsForm";
import { getCurrentProfileId } from "@/lib/current-user";
import { getTripDetail } from "@/lib/trip-detail";

export default async function EinstellungenPage({
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

  const isOrganizer = trip.participants.some(
    (p) => p.profileId === currentProfileId && p.role === "organizer",
  );

  return <TripSettingsForm trip={trip} isOrganizer={isOrganizer} />;
}

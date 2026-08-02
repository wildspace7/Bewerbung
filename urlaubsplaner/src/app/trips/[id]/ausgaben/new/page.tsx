import { notFound } from "next/navigation";
import { NewExpenseForm } from "@/components/NewExpenseForm";
import { getTripDetail } from "@/lib/trip-detail";

export default async function NewExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trip = await getTripDetail(id);

  if (!trip) notFound();

  return (
    <NewExpenseForm
      tripId={trip.id}
      currency={trip.currency}
      participants={trip.participants}
    />
  );
}

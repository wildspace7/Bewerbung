import { NewItineraryItemForm } from "@/components/NewItineraryItemForm";

export default async function NewItineraryItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <NewItineraryItemForm tripId={id} />;
}

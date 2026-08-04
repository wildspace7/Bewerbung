import { PackingList } from "@/components/PackingList";
import { getPackingItems } from "@/lib/packing";

export default async function PacklistePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { items } = await getPackingItems(id);

  return <PackingList tripId={id} initialItems={items} />;
}

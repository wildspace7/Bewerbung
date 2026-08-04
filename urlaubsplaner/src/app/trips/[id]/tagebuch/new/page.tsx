import { NewDiaryEntryForm } from "@/components/NewDiaryEntryForm";

export default async function NewDiaryEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <NewDiaryEntryForm tripId={id} />;
}

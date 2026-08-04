import type { PackingCategory, PackingItem } from "./types";

export const packingCategories: {
  value: PackingCategory;
  label: string;
  icon: string;
}[] = [
  { value: "kleidung", label: "Kleidung", icon: "👕" },
  { value: "technik", label: "Technik", icon: "🔌" },
  { value: "dokumente", label: "Dokumente", icon: "📄" },
  { value: "hygiene", label: "Hygiene", icon: "🧴" },
  { value: "sonstiges", label: "Sonstiges", icon: "🎒" },
];

function categoryLabel(category: PackingCategory | null) {
  return packingCategories.find((c) => c.value === category)?.label ?? "Ohne Kategorie";
}

/** Gruppiert nach Kategorie, in fester Reihenfolge; unkategorisiert zuletzt. */
export function groupByCategory(items: PackingItem[]) {
  const order = [...packingCategories.map((c) => c.value), null] as (
    | PackingCategory
    | null
  )[];

  return order
    .map((category) => ({
      category,
      label: categoryLabel(category),
      items: items.filter((i) => i.category === category),
    }))
    .filter((group) => group.items.length > 0);
}

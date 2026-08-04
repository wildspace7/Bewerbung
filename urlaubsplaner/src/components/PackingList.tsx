"use client";

import { useState, type FormEvent } from "react";
import { groupByCategory, packingCategories } from "@/lib/packing-categories";
import { createClient } from "@/lib/supabase/client";
import type { PackingItem } from "@/lib/types";

export function PackingList({
  tripId,
  initialItems,
}: {
  tripId: string;
  initialItems: PackingItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(packingCategories[0].value);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const checkedCount = items.filter((i) => i.isChecked).length;

  async function toggle(item: PackingItem) {
    setError(null);
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, isChecked: !i.isChecked } : i,
      ),
    );

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("packing_items")
      .update({ is_checked: !item.isChecked })
      .eq("id", item.id);

    if (updateError) {
      // Zurückrollen, wenn das Update fehlschlägt (z. B. kein echtes
      // Supabase-Projekt verbunden).
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isChecked: item.isChecked } : i)),
      );
      setError(updateError.message);
    }
  }

  async function remove(id: string) {
    const previous = items;
    setItems((prev) => prev.filter((i) => i.id !== id));

    const supabase = createClient();
    const { error: deleteError } = await supabase
      .from("packing_items")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setItems(previous);
      setError(deleteError.message);
    }
  }

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const supabase = createClient();
    const { data, error: insertError } = await supabase
      .from("packing_items")
      .insert({ trip_id: tripId, name, category })
      .select("id, name, category, is_checked")
      .single();

    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setItems((prev) => [
      ...prev,
      {
        id: data.id,
        name: data.name,
        category: data.category,
        isChecked: data.is_checked,
      },
    ]);
    setName("");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-body-sm text-ink-soft">
          {items.length === 0
            ? "Noch nichts auf der Liste"
            : `${checkedCount} von ${items.length} gepackt`}
        </p>
      </div>

      <form
        onSubmit={handleAdd}
        className="flex gap-2 rounded-lg border border-white/75 bg-white/65 p-3 shadow-[0_20px_40px_-18px_rgba(90,100,150,0.35)] backdrop-blur-[18px]"
      >
        <input
          required
          placeholder="z. B. Sonnenbrille"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="min-w-0 flex-1 rounded-md border border-white/75 bg-white/42 px-3 py-2.5 text-body text-ink placeholder:text-ink-faint outline-none focus:border-coral"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as typeof category)}
          className="rounded-md border border-white/75 bg-white/42 px-2 py-2.5 text-body text-ink outline-none focus:border-coral"
        >
          {packingCategories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.icon} {c.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={submitting || !name}
          className="shrink-0 rounded-md bg-gradient-to-br from-coral to-coral-deep px-4 py-2.5 text-button text-white shadow-[0_12px_24px_-8px_rgba(224,106,62,0.55)] disabled:opacity-50"
        >
          +
        </button>
      </form>

      {error && <p className="text-body-sm text-coral-deep">{error}</p>}

      {items.length === 0 ? (
        <div className="rounded-xl border border-white/75 bg-white/65 p-8 text-center shadow-[0_20px_40px_-18px_rgba(90,100,150,0.35)] backdrop-blur-[18px]">
          <p className="text-body text-ink-soft">
            Trag den ersten Gegenstand ein, den ihr nicht vergessen dürft.
          </p>
        </div>
      ) : (
        groupByCategory(items).map((group) => (
          <section key={group.label}>
            <h2 className="text-label uppercase text-ink-faint">
              {group.label}
            </h2>
            <ul className="mt-2 flex flex-col gap-2">
              {group.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg border border-white/75 bg-white/65 px-4 py-2.5 shadow-[0_20px_40px_-18px_rgba(90,100,150,0.35)] backdrop-blur-[18px]"
                >
                  <button
                    onClick={() => toggle(item)}
                    aria-pressed={item.isChecked}
                    aria-label={`${item.name} ${item.isChecked ? "als offen markieren" : "als gepackt markieren"}`}
                    className={
                      item.isChecked
                        ? "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-coral to-coral-deep text-white"
                        : "h-6 w-6 shrink-0 rounded-full border-2 border-ink-faint/50"
                    }
                  >
                    {item.isChecked && (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3.5 w-3.5"
                      >
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                    )}
                  </button>
                  <span
                    className={
                      item.isChecked
                        ? "flex-1 text-body text-ink-faint line-through"
                        : "flex-1 text-body text-ink"
                    }
                  >
                    {item.name}
                  </span>
                  <button
                    onClick={() => remove(item.id)}
                    aria-label={`${item.name} entfernen`}
                    className="px-1 text-ink-faint"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}

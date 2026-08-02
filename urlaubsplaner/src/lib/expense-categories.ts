import type { ExpenseCategory, PaymentMethod } from "./types";

export const expenseCategories: { value: ExpenseCategory; label: string; icon: string }[] = [
  { value: "flug", label: "Flug", icon: "✈️" },
  { value: "hotel", label: "Hotel", icon: "🏨" },
  { value: "essen", label: "Essen", icon: "🍽️" },
  { value: "aktivitaet", label: "Aktivität", icon: "🎟️" },
  { value: "transport", label: "Transport", icon: "🚗" },
  { value: "sonstiges", label: "Sonstiges", icon: "🧾" },
];

export function categoryIcon(category: ExpenseCategory | null) {
  return expenseCategories.find((c) => c.value === category)?.icon ?? "🧾";
}

export const paymentMethods: { value: PaymentMethod; label: string }[] = [
  { value: "karte", label: "Karte" },
  { value: "bargeld", label: "Bargeld" },
];

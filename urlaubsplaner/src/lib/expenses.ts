import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";
import { demoExpenses } from "./demo-data";
import type { ExpenseCategory, ExpenseListItem, PaymentMethod } from "./types";

type ProfileRef = { name: string | null };

function one<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export async function getExpenses(
  tripId: string,
): Promise<{ expenses: ExpenseListItem[]; isDemo: boolean }> {
  if (!isSupabaseConfigured) {
    return { expenses: demoExpenses[tripId] ?? [], isDemo: true };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("expenses")
    .select(
      "id, title, amount, currency, category, payment_method, expense_date, profiles(name), expense_splits(participant_id)",
    )
    .eq("trip_id", tripId)
    .order("expense_date", { ascending: false });

  if (error) throw error;

  const expenses = (
    data as {
      id: string;
      title: string;
      amount: number | string;
      currency: string | null;
      category: string | null;
      payment_method: string | null;
      expense_date: string;
      profiles: ProfileRef | ProfileRef[] | null;
      expense_splits: { participant_id: string | null }[] | null;
    }[]
  ).map(
    (row): ExpenseListItem => ({
      id: row.id,
      title: row.title,
      amount: Number(row.amount),
      currency: row.currency ?? "EUR",
      category: row.category as ExpenseCategory | null,
      paymentMethod: (row.payment_method ?? "karte") as PaymentMethod,
      paidByName: one(row.profiles)?.name ?? "Unbekannt",
      expenseDate: row.expense_date,
      splitCount: (row.expense_splits ?? []).length,
    }),
  );

  return { expenses, isDemo: false };
}

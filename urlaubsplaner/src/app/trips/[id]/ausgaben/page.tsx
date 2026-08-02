import Link from "next/link";
import { categoryIcon } from "@/lib/expense-categories";
import { formatDay, formatMoney } from "@/lib/format";
import { getExpenses } from "@/lib/expenses";

export default async function AusgabenPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { expenses } = await getExpenses(id);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-body-sm text-ink-soft">
          {expenses.length === 0
            ? "Noch keine Ausgaben"
            : `${expenses.length} ${expenses.length === 1 ? "Ausgabe" : "Ausgaben"}`}
        </p>
        <Link
          href={`/trips/${id}/ausgaben/new`}
          className="flex items-center gap-1.5 rounded-md bg-gradient-to-br from-coral to-coral-deep px-4 py-2 text-button text-white shadow-[0_12px_24px_-8px_rgba(224,106,62,0.55)]"
        >
          + Ausgabe
        </Link>
      </div>

      {expenses.length === 0 ? (
        <div className="rounded-xl border border-white/75 bg-white/65 p-8 text-center shadow-[0_20px_40px_-18px_rgba(90,100,150,0.35)] backdrop-blur-[18px]">
          <p className="text-body text-ink-soft">
            Trag die erste Ausgabe ein, um zu sehen, wer wem was schuldet.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {expenses.map((expense) => (
            <li
              key={expense.id}
              className="flex items-center gap-3 rounded-lg border border-white/75 bg-white/65 p-4 shadow-[0_20px_40px_-18px_rgba(90,100,150,0.35)] backdrop-blur-[18px]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/60 text-lg">
                {categoryIcon(expense.category)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-body font-bold text-ink">
                  {expense.title}
                </p>
                <p className="text-body-sm text-ink-soft">
                  Bezahlt von {expense.paidByName} · geteilt durch{" "}
                  {expense.splitCount} · {formatDay(expense.expenseDate)}
                </p>
              </div>
              <span className="whitespace-nowrap text-h3 text-ink">
                {formatMoney(expense.amount, expense.currency)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

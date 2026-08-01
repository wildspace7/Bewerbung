const dayMonth = new Intl.DateTimeFormat("de-DE", {
  day: "numeric",
  month: "short",
});

const weekdayDayMonth = new Intl.DateTimeFormat("de-DE", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

export function formatDateRange(start: string | null, end: string | null) {
  if (!start || !end) return "Termin noch offen";

  const startDate = new Date(start);
  const endDate = new Date(end);
  const days =
    Math.round((endDate.getTime() - startDate.getTime()) / 86_400_000) + 1;

  return `${dayMonth.format(startDate)} – ${dayMonth.format(endDate)} · ${days} Tage`;
}

export function formatDay(date: string) {
  return weekdayDayMonth.format(new Date(date));
}

export function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

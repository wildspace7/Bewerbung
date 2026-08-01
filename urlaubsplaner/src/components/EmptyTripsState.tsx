export function EmptyTripsState() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-xl border border-white/75 bg-white/65 p-8 text-center shadow-[0_20px_40px_-18px_rgba(90,100,150,0.35)] backdrop-blur-[18px]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-coral to-coral-deep shadow-[0_12px_24px_-8px_rgba(224,106,62,0.55)]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7"
          >
            <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2.5 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
          </svg>
        </div>

        <h2 className="mt-5 text-h2 text-ink">Noch keine Urlaube geplant</h2>
        <p className="mt-2 text-body text-ink-soft">
          Leg deinen ersten Urlaub an und sammle Termine, Kosten und
          Kostenaufteilung mit deinen Mitreisenden an einem Ort.
        </p>

        <button className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-to-br from-coral to-coral-deep px-6 py-3.5 text-button text-white shadow-[0_12px_24px_-8px_rgba(224,106,62,0.55)]">
          + Neuen Urlaub planen
        </button>
      </div>
    </div>
  );
}

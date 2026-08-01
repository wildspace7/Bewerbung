"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { tripTabs } from "@/lib/trip-tabs";

export function TripTabs({ tripId }: { tripId: string }) {
  const pathname = usePathname();
  const base = `/trips/${tripId}`;

  return (
    <nav
      aria-label="Trip-Bereiche"
      className="-mx-5 mt-5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <ul className="flex w-max gap-2">
        {tripTabs.map((tab) => {
          const href = tab.segment ? `${base}/${tab.segment}` : base;
          const isActive = pathname === href;

          if (!tab.ready) {
            return (
              <li key={tab.label}>
                <span
                  title={`Kommt in Phase ${tab.phase}`}
                  className="flex cursor-default items-center gap-1.5 rounded-xs border border-white/50 bg-white/30 px-3.5 py-2 text-body-sm text-ink-faint backdrop-blur-[14px]"
                >
                  {tab.label}
                  <span className="text-label uppercase opacity-70">bald</span>
                </span>
              </li>
            );
          }

          return (
            <li key={tab.label}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? "block rounded-xs bg-gradient-to-br from-coral to-coral-deep px-3.5 py-2 text-body-sm font-bold text-white shadow-[0_12px_24px_-8px_rgba(224,106,62,0.55)]"
                    : "block rounded-xs border border-white/75 bg-white/42 px-3.5 py-2 text-body-sm text-ink backdrop-blur-[14px]"
                }
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

import Link from "next/link";

export function BackButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      aria-label="Zurück"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-white/75 bg-white/42 shadow-[0_4px_14px_rgba(80,90,140,0.12)] backdrop-blur-[14px]"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 text-ink"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </Link>
  );
}

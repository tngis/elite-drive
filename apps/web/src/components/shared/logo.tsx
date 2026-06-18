import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-2.5 font-semibold", className)}
    >
      <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-orange-600 text-white shadow-sm shadow-brand/40 transition-transform duration-300 group-hover:scale-105">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="size-5"
          aria-hidden="true"
        >
          <path
            d="M5 16l1.5-4.5A2 2 0 0 1 8.4 10h7.2a2 2 0 0 1 1.9 1.5L19 16M5 16h14M5 16v2m14-2v2M7.5 13.5h9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="8" cy="16" r="1.1" fill="currentColor" />
          <circle cx="16" cy="16" r="1.1" fill="currentColor" />
        </svg>
      </span>
      <span className="font-heading text-[17px] font-bold leading-none tracking-tight">
        Elite<span className="text-brand">Drive</span>
      </span>
    </Link>
  );
}

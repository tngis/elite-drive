import type { ReactNode } from "react";

// Мэдээллийн хуудсуудын нийтлэг бүтэц (гарчиг + дэд гарчиг + агуулга).
export function ContentPage({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
        <span className="size-1.5 rounded-full bg-brand" />
        Elite Drive
      </div>
      <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 text-pretty text-lg text-muted-foreground">{subtitle}</p>
      )}
      <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-muted-foreground [&_a]:font-medium [&_a]:text-brand-foreground [&_a]:underline [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_strong]:text-foreground">
        {children}
      </div>
    </div>
  );
}

// FAQ / задардаг item (native details — JS шаардахгүй)
export function Faq({ q, a }: { q: string; a: ReactNode }) {
  return (
    <details className="group rounded-xl border border-border bg-card p-4 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer items-center justify-between gap-3 font-medium text-foreground">
        {q}
        <span className="text-muted-foreground transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="mt-3 text-sm leading-relaxed text-muted-foreground">{a}</div>
    </details>
  );
}

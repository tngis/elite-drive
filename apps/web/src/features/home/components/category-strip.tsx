import Link from "next/link";
import { categories } from "@/features/cars/data";

export function CategoryStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
        Ангилалаар хайх
      </h2>
      <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {categories.map((c) => (
          <Link
            key={c.label}
            href={`/cars?category=${encodeURIComponent(c.label)}`}
            className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center transition-all hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-md hover:shadow-black/5"
          >
            <span className="text-2xl">{c.emoji}</span>
            <span className="text-sm font-medium">{c.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

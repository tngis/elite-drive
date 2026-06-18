"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { DateField } from "./date-field";
import { startOfToday, toISO } from "./calendar-month";

// Анхдагч огноо: өнөөдөр → +3 өдөр
function defaultRange() {
  const start = startOfToday();
  const end = new Date(start);
  end.setDate(end.getDate() + 3);
  return { from: toISO(start), to: toISO(end) };
}

// Шилэн (glassmorphism), минимал хайлтын мөр — cover зураг дээр сууна.
export function SearchBar() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [from, setFrom] = useState(() => defaultRange().from);
  const [to, setTo] = useState(() => defaultRange().to);

  function handleSearch() {
    const params = new URLSearchParams();
    if (location) params.set("loc", location);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    router.push(`/cars?${params.toString()}`);
  }

  return (
    <div className="rounded-[1.4rem] border border-white/15 bg-white/10 p-1.5 shadow-2xl shadow-black/40 ring-1 ring-inset ring-white/5 backdrop-blur-xl">
      <div className="grid grid-cols-1 gap-2 divide-white/10 md:grid-cols-[1.3fr_1.7fr_auto] md:divide-x">
        {/* Байршил */}
        <label className="flex cursor-text items-center gap-3 rounded-2xl px-4 py-3 transition-colors hover:bg-white/5">
          <MapPin className="size-4 shrink-0 text-white/60" />
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-medium uppercase tracking-wider text-white/55">
              Байршил
            </span>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Хот, дүүрэг"
              className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
          </span>
        </label>

        {/* Огноо — нэг талбар (гариг + N өдөр) */}
        <div className="h-full rounded-2xl">
        <DateField
          from={from}
          to={to}
          onChange={(f, t) => {
            setFrom(f);
            setTo(t);
          }}
          />
          </div>

        <div className="p-1.5">
          <button
            onClick={handleSearch}
            className="flex h-full w-full items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-all hover:brightness-105 active:scale-[0.98] md:py-0"
          >
            <Search className="size-4" />
            Хайх
          </button>
        </div>
      </div>
    </div>
  );
}

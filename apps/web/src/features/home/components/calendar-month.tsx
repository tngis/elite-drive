"use client";

import { cn } from "@/lib/utils";

export const WEEKDAYS = ["Да", "Мя", "Лх", "Пү", "Ба", "Бя", "Ня"];

export function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function fmt(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${Number(m)}-р сар ${Number(d)}`;
}

function buildMonth(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7; // Даваа = 0
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = Array.from({ length: offset }, () => null);
  for (let d = 1; d <= days; d++) cells.push(new Date(year, month, d));
  return cells;
}

// Нэг сарын grid — range highlight (from→to) болон minIso-оор хязгаарлана.
export function CalendarMonth({
  base,
  from,
  to,
  minIso,
  onPick,
}: {
  base: Date;
  from: string;
  to: string;
  minIso: string;
  onPick: (d: Date) => void;
}) {
  const cells = buildMonth(base.getFullYear(), base.getMonth());
  const todayIso = toISO(startOfToday());

  return (
    <div>
      <div className="grid grid-cols-7 text-center text-[11px] font-medium text-muted-foreground">
        {WEEKDAYS.map((w) => (
          <span key={w} className="py-1">
            {w}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((date, i) => {
          if (!date) return <span key={i} />;
          const iso = toISO(date);
          const disabled = iso < minIso;
          const isStart = iso === from;
          const isEnd = iso === to;
          const inRange = !!(from && to && iso > from && iso < to);
          const isToday = iso === todayIso;

          return (
            <div
              key={i}
              className={cn(
                "flex justify-center py-0.5",
                (inRange || isStart || isEnd) && "bg-brand/12",
                isStart && "rounded-l-full",
                isEnd && "rounded-r-full",
                isStart && isEnd && "rounded-full",
              )}
            >
              <button
                type="button"
                disabled={disabled}
                onClick={() => onPick(date)}
                className={cn(
                  "grid size-9 place-items-center rounded-full text-sm transition-colors",
                  disabled && "cursor-default text-muted-foreground/30",
                  !disabled && !isStart && !isEnd && "hover:bg-muted",
                  (isStart || isEnd) &&
                    "bg-brand font-semibold text-brand-foreground hover:bg-brand",
                  isToday && !isStart && !isEnd && "font-semibold text-brand",
                )}
              >
                {date.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Сар сэлгэх толгой (◀ Сар ▶)
export function MonthNav({
  view,
  onPrev,
  onNext,
  canPrev,
}: {
  view: Date;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
}) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30"
        aria-label="Өмнөх сар"
      >
        ‹
      </button>
      <span className="text-sm font-semibold">
        {view.getFullYear()} оны {view.getMonth() + 1}-р сар
      </span>
      <button
        type="button"
        onClick={onNext}
        className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
        aria-label="Дараах сар"
      >
        ›
      </button>
    </div>
  );
}

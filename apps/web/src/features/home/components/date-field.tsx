"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CalendarMonth,
  MonthNav,
  WEEKDAYS,
  startOfToday,
  toISO,
} from "./calendar-month";

function fmtWeekday(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return `${WEEKDAYS[(date.getDay() + 6) % 7]} ${m}-р сар ${d}`;
}

function dayCount(from: string, to: string): number {
  if (!from || !to) return 0;
  return Math.round(
    (new Date(to).getTime() - new Date(from).getTime()) / 86_400_000,
  );
}

export function DateField({
  from,
  to,
  onChange,
}: {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [desktop, setDesktop] = useState(true);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const today = startOfToday();
  const todayIso = toISO(today);
  const [view, setView] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );

  useEffect(() => setMounted(true), []);

  function computePos() {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const half = 330;
    const left = Math.min(
      Math.max(r.left + r.width / 2, half + 8),
      window.innerWidth - half - 8,
    );
    setPos({ top: r.bottom + 10, left });
  }

  function openPanel() {
    const d = window.matchMedia("(min-width: 768px)").matches;
    setDesktop(d);
    if (d) computePos();
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    if (desktop) {
      const onMove = () => computePos();
      window.addEventListener("resize", onMove);
      window.addEventListener("scroll", onMove, true);
      function onDown(e: MouseEvent) {
        if (panelRef.current?.contains(e.target as Node)) return;
        if (triggerRef.current?.contains(e.target as Node)) return;
        setOpen(false);
      }
      document.addEventListener("mousedown", onDown);
      return () => {
        window.removeEventListener("resize", onMove);
        window.removeEventListener("scroll", onMove, true);
        document.removeEventListener("mousedown", onDown);
      };
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, desktop]);

  function pick(date: Date) {
    const iso = toISO(date);
    if (!from || (from && to) || iso <= from) {
      onChange(iso, "");
      return;
    }
    onChange(from, iso);
    if (desktop) setTimeout(() => setOpen(false), 160);
  }

  const canPrev = !(
    view.getFullYear() === today.getFullYear() &&
    view.getMonth() === today.getMonth()
  );
  const days = dayCount(from, to);

  // Утсанд: өнөөдрөөс эхлэн 12 сарын босоо жагсаалт (scroll)
  const months = Array.from(
    { length: 12 },
    (_, i) => new Date(today.getFullYear(), today.getMonth() + i, 1),
  );

  return (
    <div className="relative h-full">
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={openPanel}
        className="flex h-full w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors hover:bg-white/5"
      >
        <CalendarDays className="size-4 shrink-0 text-white/60" />
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-medium uppercase tracking-wider text-white/55">
            Огноо
          </span>
          <span
            className={cn(
              "block truncate text-sm",
              from ? "text-white" : "text-white/40",
            )}
          >
            {from
              ? `${fmtWeekday(from)}${to ? ` ー ${fmtWeekday(to)}` : " - ..."}`
              : "Огноо нэмэх"}
          </span>
        </span>
        {days > 0 && (
          <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white">
            {days} өдөр
          </span>
        )}
      </button>

      {/* Popover (portal → body, overflow/stacking-аас гарна) */}
      {mounted &&
        open &&
        createPortal(
          desktop ? (
            <div
              ref={panelRef}
              style={{ position: "fixed", top: pos.top, left: pos.left }}
              className="z-[100] w-[min(660px,92vw)] -translate-x-1/2 rounded-2xl border border-border bg-popover p-4 shadow-2xl"
            >
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <MonthNav
                    view={view}
                    canPrev={canPrev}
                    onPrev={() =>
                      setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))
                    }
                    onNext={() =>
                      setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))
                    }
                  />
                  <CalendarMonth
                    base={view}
                    from={from}
                    to={to}
                    minIso={todayIso}
                    onPick={pick}
                  />
                </div>
                <div>
                  <p className="mb-2 text-center text-sm font-semibold">
                    {new Date(view.getFullYear(), view.getMonth() + 1, 1).getFullYear()}{" "}
                    оны {((view.getMonth() + 1) % 12) + 1}-р сар
                  </p>
                  <CalendarMonth
                    base={new Date(view.getFullYear(), view.getMonth() + 1, 1)}
                    from={from}
                    to={to}
                    minIso={todayIso}
                    onPick={pick}
                  />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <button
                  type="button"
                  onClick={() => onChange("", "")}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Цэвэрлэх
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-brand-foreground transition hover:brightness-105"
                >
                  Болсон
                </button>
              </div>
            </div>
          ) : (
            <div className="fixed inset-0 z-[100] flex flex-col bg-background">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <p className="font-semibold">Огноо сонгох</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-muted"
                  aria-label="Хаах"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="space-y-8">
                  {months.map((mDate) => (
                    <div key={`${mDate.getFullYear()}-${mDate.getMonth()}`}>
                      <p className="mb-3 text-center text-sm font-semibold">
                        {mDate.getFullYear()} оны {mDate.getMonth() + 1}-р сар
                      </p>
                      <CalendarMonth
                        base={mDate}
                        from={from}
                        to={to}
                        minIso={todayIso}
                        onPick={pick}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-border p-4">
                {from && (
                  <button
                    type="button"
                    onClick={() => onChange("", "")}
                    className="mb-3 block w-full text-center text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    Цэвэрлэх
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={!from}
                  className="w-full rounded-2xl bg-brand py-3.5 text-sm font-semibold text-brand-foreground transition hover:brightness-105 disabled:opacity-40"
                >
                  {from && to
                    ? "Баталгаажуулах"
                    : from
                      ? "Дуусах огноогоо сонгоно уу"
                      : "Огноо сонгоно уу"}
                </button>
              </div>
            </div>
          ),
          document.body,
        )}
    </div>
  );
}

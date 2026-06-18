import type { Metadata } from "next";
import Link from "next/link";
import {
  Wallet,
  ShieldCheck,
  CalendarClock,
  Camera,
  KeyRound,
  TrendingUp,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Машинаа түрээслүүлэх — Elite Drive",
  description:
    "Машинаа Elite Drive дээр нийтэлж, сул зогсож буй цагт нь орлого олоорой.",
};

const benefits = [
  { icon: Wallet, title: "Нэмэлт орлого", text: "Сул зогсож буй машинаа түрээслүүлж сар бүр тогтмол орлого олоорой." },
  { icon: ShieldCheck, title: "Та хяналтандаа", text: "Үнэ, боломжит огноо, хэнд түрээслэхээ өөрөө шийднэ." },
  { icon: CalendarClock, title: "Уян хатан", text: "Хүссэн үедээ зар идэвхгүй болгож, өөрөө ашиглаж болно." },
];

const steps = [
  { icon: Camera, title: "Машинаа нийтэл", text: "Зураг, үнэлгээ, тоноглолоо оруулаад хэдхэн минутад зар үүснэ." },
  { icon: KeyRound, title: "Хүсэлт хүлээж ав", text: "Түрээслэгчийн хүсэлтийг харж, зөвшөөрөх эсэхээ шийднэ." },
  { icon: TrendingUp, title: "Орлогоо нэмэгдүүл", text: "Сайн үнэлгээ цуглуулж, илүү олон захиалга авна." },
];

export default function HostPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-brand/[0.07] to-transparent">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-brand" />
            Машины эзэн болоорой
          </div>
          <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Машинаа түрээслүүлж <span className="text-brand">орлого</span> олоорой
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
            Гражд зогсож буй машинаа Elite Drive дээр нийтлээд, өөрт тохирсон
            үнээр, өөрийн нөхцөлөөр түрээслүүлээрэй.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard/cars/new"
              className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/25 transition-all hover:brightness-105 active:scale-[0.98]"
            >
              Машинаа нэмэх
            </Link>
            <Link
              href="/register"
              className="rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold transition-colors hover:bg-accent"
            >
              Эхлээд бүртгүүлэх
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="rounded-2xl border border-border bg-card p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-brand/10 text-brand">
                <b.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold">{b.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-semibold tracking-tight">
            3 алхамд эхэл
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="relative rounded-2xl border border-border bg-card p-6">
                <span className="absolute right-5 top-5 text-3xl font-bold text-brand/15">
                  {i + 1}
                </span>
                <span className="grid size-11 place-items-center rounded-xl bg-brand/10 text-brand">
                  <s.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/dashboard/cars/new"
              className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/25 transition-all hover:brightness-105 active:scale-[0.98]"
            >
              Одоо эхлэх
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

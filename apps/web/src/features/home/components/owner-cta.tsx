import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  "Сул зогсож буй машинаа орлого болго",
  "Үнэ, боломжит цагаа өөрөө удирд",
  "Баталгаажсан түрээслэгчид",
];

export function OwnerCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 text-primary-foreground sm:px-12 sm:py-16">
        <div className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-brand/30 blur-3xl" />
        <div className="relative grid items-center gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Машинтай юу? Орлого болго.
            </h2>
            <p className="mt-3 max-w-md text-primary-foreground/80">
              Машинаа Elite Drive дээр түрээслүүлж, сул цагт нь тогтмол орлого
              олоорой. Бүртгүүлэх үнэгүй.
            </p>
            <ul className="mt-6 space-y-2">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm">
                  <span className="grid size-5 place-items-center rounded-full bg-brand text-brand-foreground">
                    <Check className="size-3" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
            <Button
              asChild
              size="lg"
              className="mt-8 bg-brand text-brand-foreground hover:bg-brand/90"
            >
              <Link href="/host">Машинаа бүртгүүлэх</Link>
            </Button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm text-primary-foreground/70">
              Дундаж сарын орлого
            </p>
            <p className="mt-1 text-4xl font-bold">1,800,000₮</p>
            <p className="mt-1 text-sm text-primary-foreground/70">
              идэвхтэй машин тутамд*
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
              <div>
                <p className="text-2xl font-semibold">15 мин</p>
                <p className="text-xs text-primary-foreground/70">
                  бүртгэх хугацаа
                </p>
              </div>
              <div>
                <p className="text-2xl font-semibold">0₮</p>
                <p className="text-xs text-primary-foreground/70">
                  бүртгэлийн хураамж
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

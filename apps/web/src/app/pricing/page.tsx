import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { ContentPage } from "@/features/marketing/content-page";

export const metadata: Metadata = {
  title: "Үнэ тариф — Elite Drive",
  description: "Elite Drive-ийн шимтгэл, төлбөрийн нөхцөл.",
};

export default function PricingPage() {
  return (
    <ContentPage
      title="Үнэ тариф"
      subtitle="Энгийн, ил тод. Нуугдсан төлбөргүй."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="!mt-0 text-foreground">Түрээслэгчид</h2>
          <p className="mt-1 text-sm">Машин хайж, түрээслэхэд:</p>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              "Бүртгүүлэх, хайх — үнэгүй",
              "Үйлчилгээний шимтгэл: түрээсийн дүнгийн 10%",
              "Барьцаа (deposit) — машин бүрээр өөр",
              "Захиалга баталгаажих хүртэл төлбөр суутгахгүй",
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="!mt-0 text-foreground">Эзэд</h2>
          <p className="mt-1 text-sm">Машинаа түрээслүүлэхэд:</p>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              "Машин нийтлэх — үнэгүй",
              "Үнээ өөрөө тогтооно",
              "Орлогоос платформын шимтгэл суутгана",
              "Боломжит огноо, deposit-оо өөрөө удирдана",
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h2>Төлбөрийн арга</h2>
      <p>
        Одоогоор төлбөрийг <strong>банкны шилжүүлэг, QPay, SocialPay</strong>{" "}
        эсвэл бэлнээр гүйцэтгэж, платформ дээр баталгаажуулна. Онлайн автомат
        төлбөр (escrow) удахгүй нэмэгдэнэ.
      </p>

      <p>
        Асуулт байвал <Link href="/contact">бидэнтэй холбогдоорой</Link> эсвэл{" "}
        <Link href="/faq">түгээмэл асуултаас</Link> хараарай.
      </p>
    </ContentPage>
  );
}

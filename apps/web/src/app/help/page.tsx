import type { Metadata } from "next";
import Link from "next/link";
import { Search, Car, CalendarCheck, Wallet, ShieldCheck, MessageCircle } from "lucide-react";
import { ContentPage } from "@/features/marketing/content-page";

export const metadata: Metadata = {
  title: "Тусламжийн төв — Elite Drive",
  description: "Elite Drive ашиглахад хэрэгтэй заавар, тусламж.",
};

const topics = [
  { icon: Car, title: "Машин нийтлэх", text: "Зар үүсгэх, зураг оруулах, үнэ тогтоох", href: "/host" },
  { icon: Search, title: "Машин хайх", text: "Шүүлтүүр, огноогоор боломжтойг шалгах", href: "/cars" },
  { icon: CalendarCheck, title: "Захиалга", text: "Хүсэлт илгээх, статус хянах, цуцлах", href: "/bookings" },
  { icon: Wallet, title: "Төлбөр", text: "Төлбөрийн арга, шимтгэл, барьцаа", href: "/pricing" },
  { icon: ShieldCheck, title: "Аюулгүй байдал", text: "Найдвартай түрээслэх зөвлөмж", href: "/safety" },
  { icon: MessageCircle, title: "Холбоо барих", text: "Бидэнтэй шууд холбогдох", href: "/contact" },
];

export default function HelpPage() {
  return (
    <ContentPage
      title="Тусламжийн төв"
      subtitle="Танд хэрэгтэй сэдвээ сонгоно уу."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {topics.map((t) => (
          <Link
            key={t.title}
            href={t.href}
            className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
              <t.icon className="size-5" />
            </span>
            <span>
              <span className="block font-medium text-foreground">{t.title}</span>
              <span className="mt-0.5 block text-sm text-muted-foreground">
                {t.text}
              </span>
            </span>
          </Link>
        ))}
      </div>

      <p>
        Хариултаа олж чадаагүй бол{" "}
        <Link href="/faq">Түгээмэл асуулт</Link> хэсгийг үзэх эсвэл{" "}
        <Link href="/contact">бидэнтэй холбогдоорой</Link>.
      </p>
    </ContentPage>
  );
}

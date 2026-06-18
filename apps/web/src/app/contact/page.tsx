import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { ContentPage } from "@/features/marketing/content-page";

export const metadata: Metadata = {
  title: "Холбоо барих — Elite Drive",
  description: "Elite Drive-тай холбогдох арга замууд.",
};

const items = [
  { icon: Phone, label: "Утас", value: "+976 7700-0000", href: "tel:+97677000000" },
  { icon: Mail, label: "Имэйл", value: "help@elitedrive.mn", href: "mailto:help@elitedrive.mn" },
  { icon: MapPin, label: "Хаяг", value: "Улаанбаатар, Сүхбаатар дүүрэг" },
  { icon: Clock, label: "Ажиллах цаг", value: "Даваа–Бямба, 09:00–19:00" },
];

export default function ContactPage() {
  return (
    <ContentPage
      title="Холбоо барих"
      subtitle="Асуулт, санал хүсэлт байвал бидэнтэй холбогдоорой."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((it) => {
          const inner = (
            <>
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
                <it.icon className="size-5" />
              </span>
              <span>
                <span className="block text-xs text-muted-foreground">
                  {it.label}
                </span>
                <span className="block font-medium text-foreground">
                  {it.value}
                </span>
              </span>
            </>
          );
          return it.href ? (
            <a
              key={it.label}
              href={it.href}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent"
            >
              {inner}
            </a>
          ) : (
            <div
              key={it.label}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
            >
              {inner}
            </div>
          );
        })}
      </div>
    </ContentPage>
  );
}

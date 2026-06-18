import Link from "next/link";
import { Logo } from "@/components/shared/logo";

const footerLinks = [
  {
    title: "Платформ",
    links: [
      { label: "Машин хайх", href: "/cars" },
      { label: "Машинаа түрээслүүлэх", href: "/host" },
      { label: "Хэрхэн ажилладаг", href: "/#how-it-works" },
      { label: "Үнэ тариф", href: "/pricing" },
    ],
  },
  {
    title: "Дэмжлэг",
    links: [
      { label: "Тусламжийн төв", href: "/help" },
      { label: "Аюулгүй байдал", href: "/safety" },
      { label: "Холбоо барих", href: "/contact" },
      { label: "Түгээмэл асуулт", href: "/faq" },
    ],
  },
  {
    title: "Компани",
    links: [
      { label: "Бидний тухай", href: "/about" },
      { label: "Үйлчилгээний нөхцөл", href: "/terms" },
      { label: "Нууцлалын бодлого", href: "/privacy" },
      { label: "Карьер", href: "/careers" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30 pb-24 md:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Түрээслэгч болон түрээслүүлэгчийг холбосон Монголын машин түрээсийн
              зах зээл.
            </p>
          </div>
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold">{group.title}</h3>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Elite Drive. Бүх эрх хуулиар хамгаалагдсан.</p>
          <p>Улаанбаатар, Монгол улс</p>
        </div>
      </div>
    </footer>
  );
}

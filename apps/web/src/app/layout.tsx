import type { Metadata } from "next";
import { Manrope, Unbounded } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { ConditionalFooter } from "@/components/layout/conditional-footer";
import { BottomNavSpacer } from "@/components/layout/bottom-nav-spacer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { Providers } from "./providers";

// Бие — цэвэр, орчин үеийн (кирилл дэмждэг)
const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

// Гарчиг — өвөрмөц, премиум display (кирилл дэмждэг)
const unbounded = Unbounded({
  variable: "--font-heading",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Elite Drive — Монголын машин түрээсийн платформ",
  description:
    "Машинаа түрээслүүлж орлого олоорой, эсвэл өөртөө таарсан машинаа хялбар түрээслээрэй. Монголын хамгийн том машин түрээсийн зах зээл.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="mn"
      className={`${manrope.variable} ${unbounded.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col bg-background"
        suppressHydrationWarning
      >
        <Providers>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <ConditionalFooter />
          {/* Footer-гүй хуудсуудад мобайл bottom navbar-ын зай */}
          <BottomNavSpacer />
          <MobileBottomNav />
        </Providers>
      </body>
    </html>
  );
}

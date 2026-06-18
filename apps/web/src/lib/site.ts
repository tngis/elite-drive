export const siteConfig = {
  name: "Elite Drive",
  tagline: "Монголын машин түрээсийн платформ",
  nav: [
    { label: "Машин хайх", href: "/cars" },
    { label: "Хэрхэн ажилладаг", href: "/#how-it-works" },
    { label: "Машинаа түрээслүүлэх", href: "/host" },
    { label: "Тусламж", href: "/help" },
  ],
} as const;

export type NavItem = (typeof siteConfig.nav)[number];

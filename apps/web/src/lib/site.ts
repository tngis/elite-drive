export const siteConfig = {
  name: "Elite Drive",
  tagline: "Монголын машин түрээсийн платформ",
  nav: [
    { label: "Машин хайх", href: "/cars" },
    { label: "Машинаа түрээслүүлэх", href: "/host" },
    { label: "Тусламж", href: "/help" },
  ],
} as const;

export type NavItem = (typeof siteConfig.nav)[number];

"use client";

import { usePathname } from "next/navigation";

// Нүүрнээс бусад (footer-гүй) хуудсуудад мобайл bottom navbar-ын доод зай.
// Нүүр хуудсанд footer өөрөө зай үүсгэдэг тул хэрэггүй.
export function BottomNavSpacer() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return (
    <div
      aria-hidden
      className="h-[calc(5rem+env(safe-area-inset-bottom))] shrink-0 md:hidden"
    />
  );
}

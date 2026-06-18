"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "./site-footer";

// Footer зөвхөн нүүр хуудсанд (/) харагдана.
export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname !== "/") return null;
  return <SiteFooter />;
}

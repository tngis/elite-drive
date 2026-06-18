import {
  carCategories,
  transmissions,
  fuelTypes,
} from "@elite-drive/types";
import type { CarCategory, FuelType, Transmission } from "./types";

// Ангилал + emoji (нүүр хуудасны strip-д)
export const categories: { label: CarCategory; emoji: string }[] = [
  { label: "Сэдан", emoji: "🚗" },
  { label: "SUV", emoji: "🚙" },
  { label: "Жийп", emoji: "🛻" },
  { label: "Люкс", emoji: "✨" },
  { label: "Цахилгаан", emoji: "⚡" },
  { label: "Гэр бүл", emoji: "👨‍👩‍👧" },
];

export const allCategories: CarCategory[] = [...carCategories];
export const allTransmissions: Transmission[] = [...transmissions];
export const allFuels: FuelType[] = [...fuelTypes];

export const priceBounds = { min: 50000, max: 500000 };

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("mn-MN").format(value) + "₮";
}

// Зураггүй машинд тогтвортой gradient placeholder (id-ээс)
const gradients = [
  "from-stone-700 to-stone-900",
  "from-emerald-700 to-emerald-900",
  "from-red-800 to-zinc-900",
  "from-indigo-800 to-slate-900",
  "from-sky-800 to-slate-900",
  "from-amber-700 to-stone-900",
  "from-violet-800 to-slate-900",
  "from-teal-800 to-slate-900",
];

export function gradientFor(id: string): string {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return gradients[sum % gradients.length];
}

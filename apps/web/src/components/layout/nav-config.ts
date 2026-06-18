import { Home, Car, Warehouse, CalendarCheck } from "lucide-react";

// Header (таблет+) болон доод navbar (утас) хоёрын хуваалцдаг үндсэн навигаци.
// Профайл нь тус бүрдээ онцгойлон (аватараар) гардаг тул энд ороогүй.
export const mainNav = [
  { href: "/", icon: Home, label: "Нүүр", exact: true },
  { href: "/cars", icon: Car, label: "Хайх" },
  { href: "/dashboard/cars", icon: Warehouse, label: "Миний гараж" },
  { href: "/bookings", icon: CalendarCheck, label: "Захиалга" },
] satisfies Array<{
  href: string;
  icon: React.ElementType;
  label: string;
  exact?: boolean;
}>;

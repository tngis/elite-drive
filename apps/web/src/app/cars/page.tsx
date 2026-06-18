import type { Metadata } from "next";
import { CarsBrowser } from "@/features/cars/components/cars-browser";

export const metadata: Metadata = {
  title: "Машин хайх — Elite Drive",
  description: "Байршил, огноо, ангилалаар шүүж машинаа олоорой.",
};

export default async function CarsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  return <CarsBrowser initialCategory={category} />;
}

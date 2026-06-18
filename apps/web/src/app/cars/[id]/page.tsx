import type { Metadata } from "next";
import { CarDetail } from "@/features/cars/components/car-detail";

export const metadata: Metadata = {
  title: "Машины дэлгэрэнгүй — Elite Drive",
};

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CarDetail id={id} />;
}

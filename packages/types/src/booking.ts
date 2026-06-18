import { z } from "zod";
import { paymentMethodSchema } from "./enums";
import type { BookingStatus, PaymentMethod, PaymentStatus } from "./enums";

// Түрээсийн хүсэлт үүсгэх
export const bookingInputSchema = z
  .object({
    carId: z.string().min(1),
    startDate: z.string(), // YYYY-MM-DD
    endDate: z.string(),
    pickupLocation: z.string().trim().max(120).optional().or(z.literal("")),
    note: z.string().trim().max(500).optional().or(z.literal("")),
    paymentMethod: paymentMethodSchema,
  })
  .refine((d) => d.endDate > d.startDate, {
    message: "Буцаах огноо авах огнооноос хойш байх ёстой",
    path: ["endDate"],
  });
export type BookingInput = z.infer<typeof bookingInputSchema>;

// Үнийн задаргаа (frontend дээр урьдчилан харах + backend баталгаажуулна)
export const SERVICE_FEE_RATE = 0.1;

export interface PriceBreakdown {
  days: number;
  pricePerDay: number;
  subtotal: number;
  serviceFee: number;
  deposit: number;
  total: number;
}

export function calcPrice(
  pricePerDay: number,
  deposit: number,
  days: number,
): PriceBreakdown {
  const subtotal = pricePerDay * days;
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
  return {
    days,
    pricePerDay,
    subtotal,
    serviceFee,
    deposit,
    total: subtotal + serviceFee + deposit,
  };
}

export function daysBetween(from: string, to: string): number {
  if (!from || !to) return 0;
  const ms = new Date(to).getTime() - new Date(from).getTime();
  const days = Math.round(ms / 86_400_000);
  return days > 0 ? days : 0;
}

export const bookingDecisionSchema = z.object({
  reason: z.string().trim().max(300).optional().or(z.literal("")),
});
export type BookingDecisionInput = z.infer<typeof bookingDecisionSchema>;

export interface PaymentDto {
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  deposit: number;
}

export interface BookingPartyDto {
  id: string;
  name: string;
  phone: string | null;
  avatarUrl: string | null;
}

export interface BookingCarDto {
  id: string;
  brand: string;
  name: string;
  imageUrl: string | null;
  location: string;
}

export interface BookingDto {
  id: string;
  status: BookingStatus;
  startDate: string;
  endDate: string;
  pickupLocation: string | null;
  note: string | null;
  price: PriceBreakdown;
  payment: PaymentDto;
  car: BookingCarDto;
  renter: BookingPartyDto;
  owner: BookingPartyDto;
  createdAt: string;
}

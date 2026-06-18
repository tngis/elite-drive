import { z } from "zod";

// Машины ангилал (UI Монголоор, нэг эх сурвалж)
export const carCategories = [
  "Сэдан",
  "SUV",
  "Жийп",
  "Люкс",
  "Цахилгаан",
  "Гэр бүл",
] as const;
export const carCategorySchema = z.enum(carCategories);
export type CarCategory = z.infer<typeof carCategorySchema>;

export const transmissions = ["Автомат", "Механик"] as const;
export const transmissionSchema = z.enum(transmissions);
export type Transmission = z.infer<typeof transmissionSchema>;

export const fuelTypes = ["Бензин", "Дизель", "Цахилгаан", "Гибрид"] as const;
export const fuelTypeSchema = z.enum(fuelTypes);
export type FuelType = z.infer<typeof fuelTypeSchema>;

// Захиалгын статус — pending → approved → active → completed | cancelled | rejected
export const bookingStatuses = [
  "pending",
  "approved",
  "active",
  "completed",
  "cancelled",
  "rejected",
] as const;
export const bookingStatusSchema = z.enum(bookingStatuses);
export type BookingStatus = z.infer<typeof bookingStatusSchema>;

export const bookingStatusLabels: Record<BookingStatus, string> = {
  pending: "Хүлээгдэж буй",
  approved: "Зөвшөөрсөн",
  active: "Идэвхтэй",
  completed: "Дууссан",
  cancelled: "Цуцалсан",
  rejected: "Татгалзсан",
};

// Төлбөрийн арга (Phase 1: гар арга)
export const paymentMethods = [
  "bank_transfer",
  "qpay",
  "socialpay",
  "cash",
] as const;
export const paymentMethodSchema = z.enum(paymentMethods);
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  bank_transfer: "Банкны шилжүүлэг",
  qpay: "QPay",
  socialpay: "SocialPay",
  cash: "Бэлэн",
};

export const paymentStatuses = ["pending", "paid", "refunded"] as const;
export const paymentStatusSchema = z.enum(paymentStatuses);
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;

// OTP суваг
export const otpChannels = ["phone", "email"] as const;
export const otpChannelSchema = z.enum(otpChannels);
export type OtpChannel = z.infer<typeof otpChannelSchema>;

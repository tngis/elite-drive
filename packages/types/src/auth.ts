import { z } from "zod";
import { otpChannelSchema } from "./enums";
import { phoneSchema, emailSchema, otpCodeSchema } from "./common";

// OTP хүсэх — утас эсвэл имэйлээр
export const otpRequestSchema = z
  .object({
    channel: otpChannelSchema,
    phone: phoneSchema.optional(),
    email: emailSchema.optional(),
  })
  .refine((d) => (d.channel === "phone" ? !!d.phone : !!d.email), {
    message: "Сонгосон сувгийн дагуу утас эсвэл имэйлээ оруулна уу",
    path: ["phone"],
  });
export type OtpRequestInput = z.infer<typeof otpRequestSchema>;

// OTP баталгаажуулах — шинэ хэрэглэгч бол name шаардана
export const otpVerifySchema = z
  .object({
    channel: otpChannelSchema,
    phone: phoneSchema.optional(),
    email: emailSchema.optional(),
    code: otpCodeSchema,
    name: z.string().trim().min(2, "Нэрээ оруулна уу").max(60).optional(),
  })
  .refine((d) => (d.channel === "phone" ? !!d.phone : !!d.email), {
    message: "Сонгосон сувгийн дагуу утас эсвэл имэйлээ оруулна уу",
    path: ["phone"],
  });
export type OtpVerifyInput = z.infer<typeof otpVerifySchema>;

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Нэрээ оруулна уу").max(60).optional(),
  email: emailSchema.optional().or(z.literal("")),
  phone: phoneSchema.optional().or(z.literal("")),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// Серверээс ирэх public user DTO
export interface PublicUser {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  avatarUrl: string | null;
  isAdmin: boolean;
  isBlocked: boolean;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: PublicUser;
}

export interface OtpRequestResponse {
  expiresInSec: number;
  // dev горимд (SMS/имэйл тохиргоогүй үед) кодыг буцаана — production-д null
  devCode: string | null;
}

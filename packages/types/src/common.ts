import { z } from "zod";

// Монголын утасны дугаар: 8 оронтой, 6/7/8/9-өөр эхэлдэг
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^[6-9]\d{7}$/, "8 оронтой зөв дугаар оруулна уу");

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Зөв имэйл хаяг оруулна уу");

export const otpCodeSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/, "6 оронтой код оруулна уу");

export const idSchema = z.string().min(1);

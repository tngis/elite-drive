import { z } from "zod";
import {
  carCategorySchema,
  transmissionSchema,
  fuelTypeSchema,
} from "./enums";

const currentYear = new Date().getFullYear();

// Owner машин нэмэх / засах
export const carInputSchema = z.object({
  brand: z.string().trim().min(1, "Маркаа оруулна уу").max(40),
  name: z.string().trim().min(1, "Модель оруулна уу").max(60),
  year: z
    .number({ message: "Он оруулна уу" })
    .int()
    .min(1980, "Он буруу байна")
    .max(currentYear + 1, "Он буруу байна"),
  plateNumber: z
    .string()
    .trim()
    .min(3, "Улсын дугаараа оруулна уу")
    .max(12),
  color: z.string().trim().min(1, "Өнгөө оруулна уу").max(24),
  category: carCategorySchema,
  transmission: transmissionSchema,
  fuel: fuelTypeSchema,
  seats: z.number().int().min(1).max(60),
  pricePerDay: z.number().int().min(1000, "Үнэ хэт бага байна").max(100_000_000),
  deposit: z.number().int().min(0).max(100_000_000).default(0),
  location: z.string().trim().min(2, "Байршлаа оруулна уу").max(120),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  features: z.array(z.string().trim().max(40)).max(40).default([]),
});
export type CarInput = z.infer<typeof carInputSchema>;

export const carUpdateSchema = carInputSchema.partial().extend({
  isActive: z.boolean().optional(),
});
export type CarUpdateInput = z.infer<typeof carUpdateSchema>;

// Боломжтой огнооны блок (owner хаасан/захиалагдсан өдрүүд)
export const availabilityInputSchema = z
  .object({
    startDate: z.string(), // ISO date (YYYY-MM-DD)
    endDate: z.string(),
  })
  .refine((d) => d.endDate >= d.startDate, {
    message: "Дуусах огноо эхлэхээс өмнө байж болохгүй",
    path: ["endDate"],
  });
export type AvailabilityInput = z.infer<typeof availabilityInputSchema>;

// Хайлтын шүүлтүүр (query)
export const carSearchSchema = z.object({
  q: z.string().trim().optional(),
  category: carCategorySchema.optional(),
  transmission: transmissionSchema.optional(),
  fuel: fuelTypeSchema.optional(),
  location: z.string().trim().optional(),
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().min(0).optional(),
  from: z.string().optional(), // боломжтойг шалгах огноо
  to: z.string().optional(),
  sort: z
    .enum(["recommended", "price-asc", "price-desc", "rating", "new"])
    .default("recommended"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(60).default(12),
});
export type CarSearchInput = z.infer<typeof carSearchSchema>;

// Серверийн car DTO
export interface CarImageDto {
  id: string;
  url: string;
  position: number;
}

export interface CarOwnerDto {
  id: string;
  name: string;
  avatarUrl: string | null;
  tripCount: number;
}

export interface CarDto {
  id: string;
  brand: string;
  name: string;
  year: number;
  plateNumber: string;
  color: string;
  category: string;
  transmission: string;
  fuel: string;
  seats: number;
  pricePerDay: number;
  deposit: number;
  location: string;
  description: string | null;
  features: string[];
  images: CarImageDto[];
  rating: number;
  tripCount: number;
  instantBook: boolean;
  isActive: boolean;
  owner: CarOwnerDto;
  createdAt: string;
}

export interface CarListResponse {
  items: CarDto[];
  total: number;
  page: number;
  pageSize: number;
}

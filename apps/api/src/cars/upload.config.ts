import { memoryStorage } from "multer";
import { extname } from "node:path";
import { BadRequestException } from "@nestjs/common";
import type { Request } from "express";

const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

// memoryStorage — файлыг буфер болгон авч, StorageService нь R2 эсвэл диск рүү хадгална.
export const carImageMulterOptions = {
  storage: memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 10 },
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const ext = extname(file.originalname).toLowerCase();
    if (!ALLOWED.has(ext)) {
      cb(new BadRequestException("Зөвхөн зураг (jpg, png, webp, avif)"), false);
      return;
    }
    cb(null, true);
  },
};

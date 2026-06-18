import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";
// Энэ декоратортой route нь JWT шаардахгүй (нэвтрэлтгүй харах боломжтой)
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

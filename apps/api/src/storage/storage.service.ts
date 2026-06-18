import { Injectable, Logger } from "@nestjs/common";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { writeFile, unlink, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join } from "node:path";
import { randomBytes } from "node:crypto";

/**
 * Зургийн хадгалалт. Cloudflare R2 (S3-нийцтэй) тохируулсан бол түүн рүү,
 * эс бөгөөс локал disk рүү хадгална. Хоёр тохиолдолд public URL буцаана.
 */
@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private s3: S3Client | null = null;

  get usingR2(): boolean {
    return !!(
      process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET &&
      process.env.R2_PUBLIC_URL
    );
  }

  private get bucket(): string {
    return process.env.R2_BUCKET ?? "";
  }

  private get publicBase(): string {
    return (process.env.R2_PUBLIC_URL ?? "").replace(/\/$/, "");
  }

  private client(): S3Client {
    if (!this.s3) {
      this.s3 = new S3Client({
        region: "auto",
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
        },
      });
    }
    return this.s3;
  }

  private filename(original: string): string {
    const ext = extname(original).toLowerCase();
    return `${Date.now()}-${randomBytes(8).toString("hex")}${ext}`;
  }

  private get localDir(): string {
    return join(process.cwd(), process.env.UPLOAD_DIR ?? "uploads");
  }

  /** Файл хадгалаад public URL буцаана. */
  async save(file: Express.Multer.File): Promise<string> {
    const key = this.filename(file.originalname);

    if (this.usingR2) {
      await this.client().send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
      return `${this.publicBase}/${key}`;
    }

    // Локал fallback
    if (!existsSync(this.localDir)) {
      await mkdir(this.localDir, { recursive: true });
    }
    await writeFile(join(this.localDir, key), file.buffer);
    const base = process.env.API_PUBLIC_URL ?? "http://localhost:4000";
    return `${base}/uploads/${key}`;
  }

  /** URL-аас файлыг устгана (best-effort). */
  async remove(url: string): Promise<void> {
    const key = url.split("/").pop();
    if (!key) return;
    try {
      if (this.usingR2 && url.startsWith(this.publicBase)) {
        await this.client().send(
          new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
        );
      } else if (url.includes("/uploads/")) {
        await unlink(join(this.localDir, key)).catch(() => undefined);
      }
    } catch (err) {
      this.logger.warn(`Зураг устгахад алдаа: ${String(err)}`);
    }
  }
}

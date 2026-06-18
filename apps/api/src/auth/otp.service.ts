import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { createHash, randomInt } from "node:crypto";
import type { OtpChannel } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { SmsService } from "../notifications/sms.service";
import { EmailService } from "../notifications/email.service";

const MAX_ATTEMPTS = 5;

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly sms: SmsService,
    private readonly email: EmailService,
  ) {}

  private hash(code: string): string {
    return createHash("sha256")
      .update(`${code}:${process.env.JWT_ACCESS_SECRET ?? "salt"}`)
      .digest("hex");
  }

  private get ttlSec(): number {
    return Number(process.env.OTP_TTL_SEC ?? 300);
  }

  /** Шинэ код үүсгэж илгээнэ. dev горимд кодыг буцаана. */
  async generateAndSend(
    channel: OtpChannel,
    destination: string,
  ): Promise<{ expiresInSec: number; devCode: string | null }> {
    const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
    const expiresAt = new Date(Date.now() + this.ttlSec * 1000);

    // Өмнөх идэвхтэй кодуудыг хэрэгсэхгүй болгоно
    await this.prisma.otpCode.updateMany({
      where: { channel, destination, consumedAt: null },
      data: { consumedAt: new Date() },
    });

    await this.prisma.otpCode.create({
      data: {
        channel,
        destination,
        codeHash: this.hash(code),
        expiresAt,
      },
    });

    const message = `Elite Drive: таны баталгаажуулах код ${code}. ${Math.round(
      this.ttlSec / 60,
    )} минутын дотор хүчинтэй.`;

    if (channel === "phone") {
      await this.sms.send(destination, message);
    } else {
      await this.email.send(destination, "Elite Drive — баталгаажуулах код", message);
    }

    const devMode =
      process.env.OTP_DEV_MODE === "true" ||
      (channel === "phone" ? !this.sms.configured : !this.email.configured);

    return {
      expiresInSec: this.ttlSec,
      devCode: devMode ? code : null,
    };
  }

  /** Кодыг шалгаж, зөв бол хэрэгсэхгүй болгоно. */
  async verify(
    channel: OtpChannel,
    destination: string,
    code: string,
  ): Promise<void> {
    const record = await this.prisma.otpCode.findFirst({
      where: { channel, destination, consumedAt: null },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      throw new BadRequestException("Код хүчинтэй биш. Дахин код авна уу.");
    }
    if (record.expiresAt < new Date()) {
      throw new BadRequestException("Кодын хугацаа дууссан. Дахин код авна уу.");
    }
    if (record.attempts >= MAX_ATTEMPTS) {
      throw new BadRequestException("Хэт олон оролдлого. Дахин код авна уу.");
    }

    if (record.codeHash !== this.hash(code)) {
      await this.prisma.otpCode.update({
        where: { id: record.id },
        data: { attempts: { increment: 1 } },
      });
      throw new BadRequestException("Код буруу байна.");
    }

    await this.prisma.otpCode.update({
      where: { id: record.id },
      data: { consumedAt: new Date() },
    });
  }
}

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { createHash, randomBytes } from "node:crypto";
import type { Response } from "express";
import type {
  AuthResponse,
  OtpRequestInput,
  OtpRequestResponse,
  OtpVerifyInput,
} from "@elite-drive/types";
import { PrismaService } from "../prisma/prisma.service";
import { OtpService } from "./otp.service";
import { toPublicUser } from "../users/user.mapper";

const REFRESH_COOKIE = "ed_refresh";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly otp: OtpService,
    private readonly jwt: JwtService,
  ) {}

  private destinationOf(input: { channel: string; phone?: string; email?: string }) {
    const dest = input.channel === "phone" ? input.phone : input.email;
    if (!dest) throw new BadRequestException("Утас эсвэл имэйлээ оруулна уу");
    return dest;
  }

  async requestOtp(input: OtpRequestInput): Promise<OtpRequestResponse> {
    const destination = this.destinationOf(input);
    // Хаагдсан хэрэглэгч код авч чадахгүй
    const existing = await this.findUserByDestination(input.channel, destination);
    if (existing?.isBlocked) {
      throw new UnauthorizedException("Таны эрх хаагдсан байна");
    }
    return this.otp.generateAndSend(input.channel, destination);
  }

  private findUserByDestination(channel: string, destination: string) {
    return this.prisma.user.findFirst({
      where: channel === "phone" ? { phone: destination } : { email: destination },
    });
  }

  async verifyOtp(input: OtpVerifyInput, res: Response): Promise<AuthResponse> {
    const destination = this.destinationOf(input);
    await this.otp.verify(input.channel, destination, input.code);

    let user = await this.findUserByDestination(input.channel, destination);

    if (!user) {
      if (!input.name) {
        throw new BadRequestException({
          message: "Шинэ хэрэглэгч — нэрээ оруулна уу",
          code: "NAME_REQUIRED",
        });
      }
      user = await this.prisma.user.create({
        data: {
          name: input.name,
          phone: input.channel === "phone" ? destination : null,
          email: input.channel === "email" ? destination : null,
        },
      });
    }

    if (user.isBlocked) throw new UnauthorizedException("Таны эрх хаагдсан байна");

    const accessToken = await this.issueTokens(user.id, res);
    return { accessToken, user: toPublicUser(user) };
  }

  private async issueTokens(userId: string, res: Response): Promise<string> {
    const accessTtl = Number(process.env.JWT_ACCESS_TTL ?? 900);
    const accessToken = await this.jwt.signAsync(
      { sub: userId },
      {
        secret: process.env.JWT_ACCESS_SECRET ?? "dev_access_secret_change_me",
        expiresIn: accessTtl,
      },
    );

    const refreshDays = Number(process.env.JWT_REFRESH_TTL_DAYS ?? 30);
    const refreshToken = randomBytes(48).toString("hex");
    const expiresAt = new Date(Date.now() + refreshDays * 86_400_000);
    await this.prisma.refreshToken.create({
      data: { tokenHash: this.hashToken(refreshToken), userId, expiresAt },
    });

    res.cookie(REFRESH_COOKIE, refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/api/auth",
      maxAge: refreshDays * 86_400_000,
    });

    return accessToken;
  }

  private hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  async refresh(req: { cookies?: Record<string, string> }, res: Response): Promise<AuthResponse> {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (!token) throw new UnauthorizedException("Дахин нэвтэрнэ үү");

    const record = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: this.hashToken(token) },
      include: { user: true },
    });
    if (!record || record.revokedAt || record.expiresAt < new Date()) {
      throw new UnauthorizedException("Сессийн хугацаа дууссан");
    }
    if (record.user.isBlocked) throw new UnauthorizedException("Таны эрх хаагдсан");

    // Rotation: хуучин refresh-ийг хүчингүй болгоно
    await this.prisma.refreshToken.update({
      where: { id: record.id },
      data: { revokedAt: new Date() },
    });

    const accessToken = await this.issueTokens(record.userId, res);
    return { accessToken, user: toPublicUser(record.user) };
  }

  async logout(req: { cookies?: Record<string, string> }, res: Response): Promise<void> {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (token) {
      await this.prisma.refreshToken.updateMany({
        where: { tokenHash: this.hashToken(token), revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
    res.clearCookie(REFRESH_COOKIE, { path: "/api/auth" });
  }

  async me(userId: string): Promise<AuthResponse["user"]> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    return toPublicUser(user);
  }
}

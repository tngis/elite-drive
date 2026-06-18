import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { UpdateProfileInput } from "@elite-drive/types";
import { PrismaService } from "../prisma/prisma.service";
import { toPublicUser } from "./user.mapper";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async setAvatar(userId: string, url: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: url },
    });
    return toPublicUser(user);
  }

  async updateProfile(userId: string, input: UpdateProfileInput) {
    const data: Record<string, string | null> = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.avatarUrl !== undefined) data.avatarUrl = input.avatarUrl || null;

    // Утас/имэйл өөрчлөхөд давхцал шалгана
    if (input.phone !== undefined && input.phone !== "") {
      const clash = await this.prisma.user.findFirst({
        where: { phone: input.phone, NOT: { id: userId } },
      });
      if (clash) throw new BadRequestException("Энэ дугаар бүртгэлтэй байна");
      data.phone = input.phone;
    }
    if (input.email !== undefined && input.email !== "") {
      const clash = await this.prisma.user.findFirst({
        where: { email: input.email, NOT: { id: userId } },
      });
      if (clash) throw new BadRequestException("Энэ имэйл бүртгэлтэй байна");
      data.email = input.email;
    }

    const user = await this.prisma.user
      .update({ where: { id: userId }, data })
      .catch(() => {
        throw new NotFoundException("Хэрэглэгч олдсонгүй");
      });
    return toPublicUser(user);
  }
}

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { Booking, Car, CarImage, User } from "@prisma/client";
import {
  calcPrice,
  daysBetween,
  type BookingDto,
  type BookingInput,
  type BookingStatus,
} from "@elite-drive/types";
import { PrismaService } from "../prisma/prisma.service";

type BookingWithRelations = Booking & {
  car: Car & { images: CarImage[] };
  renter: Pick<User, "id" | "name" | "phone" | "avatarUrl">;
  owner: Pick<User, "id" | "name" | "phone" | "avatarUrl">;
};

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly include = {
    car: { include: { images: true } },
    renter: { select: { id: true, name: true, phone: true, avatarUrl: true } },
    owner: { select: { id: true, name: true, phone: true, avatarUrl: true } },
  } as const;

  private map(b: BookingWithRelations): BookingDto {
    const firstImage = b.car.images.sort((x, y) => x.position - y.position)[0];
    return {
      id: b.id,
      status: b.status as BookingStatus,
      startDate: b.startDate.toISOString().slice(0, 10),
      endDate: b.endDate.toISOString().slice(0, 10),
      pickupLocation: b.pickupLocation,
      note: b.note,
      price: {
        days: b.days,
        pricePerDay: b.pricePerDay,
        subtotal: b.subtotal,
        serviceFee: b.serviceFee,
        deposit: b.deposit,
        total: b.total,
      },
      payment: {
        method: b.paymentMethod,
        status: b.paymentStatus,
        amount: b.total,
        deposit: b.deposit,
      },
      car: {
        id: b.car.id,
        brand: b.car.brand,
        name: b.car.name,
        imageUrl: firstImage?.url ?? null,
        location: b.car.location,
      },
      renter: {
        id: b.renter.id,
        name: b.renter.name,
        phone: b.renter.phone,
        avatarUrl: b.renter.avatarUrl,
      },
      owner: {
        id: b.owner.id,
        name: b.owner.name,
        phone: b.owner.phone,
        avatarUrl: b.owner.avatarUrl,
      },
      createdAt: b.createdAt.toISOString(),
    };
  }

  async create(renterId: string, input: BookingInput): Promise<BookingDto> {
    const car = await this.prisma.car.findUnique({ where: { id: input.carId } });
    if (!car || !car.isActive)
      throw new NotFoundException("Машин олдсонгүй эсвэл идэвхгүй");
    if (car.ownerId === renterId)
      throw new BadRequestException("Өөрийн машиныг захиалах боломжгүй");

    const from = new Date(input.startDate);
    const to = new Date(input.endDate);
    const days = daysBetween(input.startDate, input.endDate);
    if (days <= 0) throw new BadRequestException("Огноо буруу байна");

    await this.assertAvailable(car.id, from, to);

    const price = calcPrice(car.pricePerDay, car.deposit, days);
    // Шуурхай захиалгатай машин шууд зөвшөөрөгдөнө
    const status: BookingStatus = car.instantBook ? "approved" : "pending";

    const booking = await this.prisma.booking.create({
      data: {
        carId: car.id,
        renterId,
        ownerId: car.ownerId,
        status,
        startDate: from,
        endDate: to,
        pickupLocation: input.pickupLocation || null,
        note: input.note || null,
        pricePerDay: car.pricePerDay,
        days,
        subtotal: price.subtotal,
        serviceFee: price.serviceFee,
        deposit: price.deposit,
        total: price.total,
        paymentMethod: input.paymentMethod,
      },
      include: this.include,
    });
    return this.map(booking);
  }

  private async assertAvailable(carId: string, from: Date, to: Date) {
    const overlapBooking = await this.prisma.booking.findFirst({
      where: {
        carId,
        status: { in: ["pending", "approved", "active"] },
        startDate: { lt: to },
        endDate: { gt: from },
      },
    });
    if (overlapBooking)
      throw new BadRequestException("Сонгосон огноо аль хэдийн захиалагдсан");

    const overlapBlock = await this.prisma.availability.findFirst({
      where: { carId, startDate: { lt: to }, endDate: { gt: from } },
    });
    if (overlapBlock)
      throw new BadRequestException("Энэ хугацаанд машин боломжгүй байна");
  }

  async listAsRenter(renterId: string): Promise<BookingDto[]> {
    const rows = await this.prisma.booking.findMany({
      where: { renterId },
      include: this.include,
      orderBy: { createdAt: "desc" },
    });
    return rows.map((r) => this.map(r));
  }

  async listAsOwner(ownerId: string): Promise<BookingDto[]> {
    const rows = await this.prisma.booking.findMany({
      where: { ownerId },
      include: this.include,
      orderBy: { createdAt: "desc" },
    });
    return rows.map((r) => this.map(r));
  }

  private async getParticipantBooking(id: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: this.include,
    });
    if (!booking) throw new NotFoundException("Захиалга олдсонгүй");
    if (booking.renterId !== userId && booking.ownerId !== userId)
      throw new ForbiddenException("Энэ захиалга танд хамаарахгүй");
    return booking;
  }

  async findOne(id: string, userId: string): Promise<BookingDto> {
    return this.map(await this.getParticipantBooking(id, userId));
  }

  private async transition(
    id: string,
    userId: string,
    opts: {
      role: "owner" | "renter" | "any";
      from: BookingStatus[];
      to: BookingStatus;
      reason?: string;
      markPaid?: boolean;
    },
  ): Promise<BookingDto> {
    const booking = await this.getParticipantBooking(id, userId);

    if (opts.role === "owner" && booking.ownerId !== userId)
      throw new ForbiddenException("Зөвхөн машины эзэн хийнэ");
    if (opts.role === "renter" && booking.renterId !== userId)
      throw new ForbiddenException("Зөвхөн түрээслэгч хийнэ");

    if (!opts.from.includes(booking.status as BookingStatus)) {
      throw new BadRequestException(
        `Энэ статусаас (${booking.status}) шилжих боломжгүй`,
      );
    }

    const updated = await this.prisma.booking.update({
      where: { id },
      data: {
        status: opts.to,
        decisionReason: opts.reason ?? booking.decisionReason,
        paymentStatus: opts.markPaid ? "paid" : undefined,
      },
      include: this.include,
    });
    return this.map(updated);
  }

  approve(id: string, ownerId: string) {
    return this.transition(id, ownerId, {
      role: "owner",
      from: ["pending"],
      to: "approved",
    });
  }

  reject(id: string, ownerId: string, reason?: string) {
    return this.transition(id, ownerId, {
      role: "owner",
      from: ["pending"],
      to: "rejected",
      reason,
    });
  }

  cancel(id: string, userId: string, reason?: string) {
    return this.transition(id, userId, {
      role: "any",
      from: ["pending", "approved"],
      to: "cancelled",
      reason,
    });
  }

  // Эзэн машинаа хүлээлгэн өгөв → идэвхтэй
  start(id: string, ownerId: string) {
    return this.transition(id, ownerId, {
      role: "owner",
      from: ["approved"],
      to: "active",
    });
  }

  // Дуусгах + төлбөр баталгаажуулах (гар арга)
  complete(id: string, ownerId: string) {
    return this.transition(id, ownerId, {
      role: "owner",
      from: ["active"],
      to: "completed",
      markPaid: true,
    });
  }

  async markPaid(id: string, ownerId: string): Promise<BookingDto> {
    const booking = await this.getParticipantBooking(id, ownerId);
    if (booking.ownerId !== ownerId)
      throw new ForbiddenException("Зөвхөн машины эзэн төлбөр баталгаажуулна");
    const updated = await this.prisma.booking.update({
      where: { id },
      data: { paymentStatus: "paid" },
      include: this.include,
    });
    return this.map(updated);
  }
}

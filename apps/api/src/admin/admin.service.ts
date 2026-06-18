import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { toPublicUser } from "../users/user.mapper";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async stats() {
    const [users, cars, bookings, activeBookings] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.car.count(),
      this.prisma.booking.count(),
      this.prisma.booking.count({ where: { status: "active" } }),
    ]);
    return { users, cars, bookings, activeBookings };
  }

  async listUsers() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { cars: true, bookingsAsRenter: true } } },
    });
    return users.map((u) => ({
      ...toPublicUser(u),
      carsCount: u._count.cars,
      bookingsCount: u._count.bookingsAsRenter,
    }));
  }

  async setBlocked(userId: string, blocked: boolean) {
    const user = await this.prisma.user
      .update({ where: { id: userId }, data: { isBlocked: blocked } })
      .catch(() => {
        throw new NotFoundException("Хэрэглэгч олдсонгүй");
      });
    // Хаасан хэрэглэгчийн сессийг хүчингүй болгоно
    if (blocked) {
      await this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
    return toPublicUser(user);
  }

  async listCars() {
    const cars = await this.prisma.car.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        owner: { select: { id: true, name: true } },
        images: { take: 1, orderBy: { position: "asc" } },
      },
    });
    return cars.map((c) => ({
      id: c.id,
      brand: c.brand,
      name: c.name,
      year: c.year,
      plateNumber: c.plateNumber,
      pricePerDay: c.pricePerDay,
      location: c.location,
      isActive: c.isActive,
      imageUrl: c.images[0]?.url ?? null,
      owner: c.owner,
      createdAt: c.createdAt.toISOString(),
    }));
  }

  async setCarActive(carId: string, active: boolean) {
    const car = await this.prisma.car
      .update({ where: { id: carId }, data: { isActive: active } })
      .catch(() => {
        throw new NotFoundException("Машин олдсонгүй");
      });
    return { id: car.id, isActive: car.isActive };
  }

  async listBookings() {
    const rows = await this.prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        car: { select: { brand: true, name: true } },
        renter: { select: { name: true } },
        owner: { select: { name: true } },
      },
    });
    return rows.map((b) => ({
      id: b.id,
      status: b.status,
      startDate: b.startDate.toISOString().slice(0, 10),
      endDate: b.endDate.toISOString().slice(0, 10),
      total: b.total,
      paymentStatus: b.paymentStatus,
      car: `${b.car.brand} ${b.car.name}`,
      renter: b.renter.name,
      owner: b.owner.name,
      createdAt: b.createdAt.toISOString(),
    }));
  }
}

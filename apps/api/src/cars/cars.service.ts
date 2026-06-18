import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { Prisma, Car, CarImage, User } from "@prisma/client";
import type {
  CarDto,
  CarInput,
  CarListResponse,
  CarSearchInput,
  CarUpdateInput,
  AvailabilityInput,
} from "@elite-drive/types";
import { PrismaService } from "../prisma/prisma.service";
import { StorageService } from "../storage/storage.service";

type CarWithRelations = Car & {
  images: CarImage[];
  owner: Pick<User, "id" | "name" | "avatarUrl">;
};

// Захиалга боломжгүй болгодог статусууд
const BLOCKING_STATUSES: Prisma.EnumBookingStatusFilter = {
  in: ["pending", "approved", "active"],
};

@Injectable()
export class CarsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  // ---- mapping ----
  private async tripCountsByCar(carIds: string[]): Promise<Map<string, number>> {
    if (carIds.length === 0) return new Map();
    const grouped = await this.prisma.booking.groupBy({
      by: ["carId"],
      where: { carId: { in: carIds }, status: "completed" },
      _count: { _all: true },
    });
    return new Map(grouped.map((g) => [g.carId, g._count._all]));
  }

  private async carCountsByOwner(
    ownerIds: string[],
  ): Promise<Map<string, number>> {
    if (ownerIds.length === 0) return new Map();
    const grouped = await this.prisma.car.groupBy({
      by: ["ownerId"],
      where: { ownerId: { in: ownerIds } },
      _count: { _all: true },
    });
    return new Map(grouped.map((g) => [g.ownerId, g._count._all]));
  }

  private mapCar(
    car: CarWithRelations,
    tripCount: number,
    ownerCarCount: number,
  ): CarDto {
    return {
      id: car.id,
      brand: car.brand,
      name: car.name,
      year: car.year,
      plateNumber: car.plateNumber,
      color: car.color,
      category: car.category,
      transmission: car.transmission,
      fuel: car.fuel,
      seats: car.seats,
      pricePerDay: car.pricePerDay,
      deposit: car.deposit,
      location: car.location,
      description: car.description,
      features: car.features,
      images: car.images
        .sort((a, b) => a.position - b.position)
        .map((i) => ({ id: i.id, url: i.url, position: i.position })),
      rating: 0, // Phase 2-т review нэмэгдэнэ
      tripCount,
      instantBook: car.instantBook,
      isActive: car.isActive,
      owner: {
        id: car.owner.id,
        name: car.owner.name,
        avatarUrl: car.owner.avatarUrl,
        tripCount,
        carCount: ownerCarCount,
      },
      createdAt: car.createdAt.toISOString(),
    };
  }

  private readonly includeRelations = {
    images: true,
    owner: { select: { id: true, name: true, avatarUrl: true } },
  } as const;

  // ---- public search ----
  async search(query: CarSearchInput): Promise<CarListResponse> {
    const where: Prisma.CarWhereInput = { isActive: true };

    if (query.category) where.category = query.category;
    if (query.transmission) where.transmission = query.transmission;
    if (query.fuel) where.fuel = query.fuel;
    if (query.location)
      where.location = { contains: query.location, mode: "insensitive" };
    if (query.q)
      where.OR = [
        { brand: { contains: query.q, mode: "insensitive" } },
        { name: { contains: query.q, mode: "insensitive" } },
      ];
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.pricePerDay = {};
      if (query.minPrice !== undefined) where.pricePerDay.gte = query.minPrice;
      if (query.maxPrice !== undefined) where.pricePerDay.lte = query.maxPrice;
    }

    // Огноогоор боломжтойг шалгах
    if (query.from && query.to) {
      const from = new Date(query.from);
      const to = new Date(query.to);
      if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
        throw new BadRequestException("Огноо буруу байна");
      }
      where.NOT = {
        OR: [
          {
            availability: {
              some: { startDate: { lt: to }, endDate: { gt: from } },
            },
          },
          {
            bookings: {
              some: {
                status: BLOCKING_STATUSES,
                startDate: { lt: to },
                endDate: { gt: from },
              },
            },
          },
        ],
      };
    }

    const orderBy = this.orderByFor(query.sort);
    const skip = (query.page - 1) * query.pageSize;

    const [rows, total] = await Promise.all([
      this.prisma.car.findMany({
        where,
        include: this.includeRelations,
        orderBy,
        skip,
        take: query.pageSize,
      }),
      this.prisma.car.count({ where }),
    ]);

    const trips = await this.tripCountsByCar(rows.map((c) => c.id));
    const owners = await this.carCountsByOwner(rows.map((c) => c.ownerId));
    return {
      items: rows.map((c) =>
        this.mapCar(c, trips.get(c.id) ?? 0, owners.get(c.ownerId) ?? 0),
      ),
      total,
      page: query.page,
      pageSize: query.pageSize,
    };
  }

  private orderByFor(
    sort: CarSearchInput["sort"],
  ): Prisma.CarOrderByWithRelationInput[] {
    switch (sort) {
      case "price-asc":
        return [{ pricePerDay: "asc" }];
      case "price-desc":
        return [{ pricePerDay: "desc" }];
      case "new":
        return [{ createdAt: "desc" }];
      case "rating":
      case "recommended":
      default:
        return [{ instantBook: "desc" }, { createdAt: "desc" }];
    }
  }

  async findOne(id: string): Promise<CarDto> {
    const car = await this.prisma.car.findUnique({
      where: { id },
      include: this.includeRelations,
    });
    if (!car) throw new NotFoundException("Машин олдсонгүй");
    const trips = await this.tripCountsByCar([car.id]);
    const owners = await this.carCountsByOwner([car.ownerId]);
    return this.mapCar(car, trips.get(car.id) ?? 0, owners.get(car.ownerId) ?? 0);
  }

  // ---- owner ----
  async listMine(ownerId: string): Promise<CarDto[]> {
    const rows = await this.prisma.car.findMany({
      where: { ownerId },
      include: this.includeRelations,
      orderBy: { createdAt: "desc" },
    });
    const trips = await this.tripCountsByCar(rows.map((c) => c.id));
    const owners = await this.carCountsByOwner(rows.map((c) => c.ownerId));
    return rows.map((c) =>
      this.mapCar(c, trips.get(c.id) ?? 0, owners.get(c.ownerId) ?? 0),
    );
  }

  async create(ownerId: string, input: CarInput): Promise<CarDto> {
    const car = await this.prisma.car.create({
      data: {
        ownerId,
        brand: input.brand,
        name: input.name,
        year: input.year,
        plateNumber: input.plateNumber,
        color: input.color,
        category: input.category,
        transmission: input.transmission,
        fuel: input.fuel,
        seats: input.seats,
        pricePerDay: input.pricePerDay,
        deposit: input.deposit ?? 0,
        location: input.location,
        description: input.description || null,
        features: input.features ?? [],
      },
      include: this.includeRelations,
    });
    const ownerCount = await this.prisma.car.count({ where: { ownerId } });
    return this.mapCar(car, 0, ownerCount);
  }

  private async assertOwnership(carId: string, ownerId: string) {
    const car = await this.prisma.car.findUnique({ where: { id: carId } });
    if (!car) throw new NotFoundException("Машин олдсонгүй");
    if (car.ownerId !== ownerId)
      throw new ForbiddenException("Энэ машин таных биш");
    return car;
  }

  async update(
    ownerId: string,
    carId: string,
    input: CarUpdateInput,
  ): Promise<CarDto> {
    await this.assertOwnership(carId, ownerId);
    const car = await this.prisma.car.update({
      where: { id: carId },
      data: {
        ...input,
        description:
          input.description === undefined
            ? undefined
            : input.description || null,
      },
      include: this.includeRelations,
    });
    const trips = await this.tripCountsByCar([car.id]);
    const owners = await this.carCountsByOwner([car.ownerId]);
    return this.mapCar(car, trips.get(car.id) ?? 0, owners.get(car.ownerId) ?? 0);
  }

  async remove(ownerId: string, carId: string): Promise<{ ok: true }> {
    await this.assertOwnership(carId, ownerId);
    const activeBooking = await this.prisma.booking.findFirst({
      where: { carId, status: { in: ["approved", "active"] } },
    });
    if (activeBooking) {
      throw new BadRequestException(
        "Идэвхтэй захиалгатай машиныг устгах боломжгүй",
      );
    }
    await this.prisma.car.delete({ where: { id: carId } });
    return { ok: true };
  }

  // ---- images ----
  async addImages(
    ownerId: string,
    carId: string,
    urls: string[],
  ): Promise<CarDto> {
    await this.assertOwnership(carId, ownerId);
    const existing = await this.prisma.carImage.count({ where: { carId } });
    await this.prisma.carImage.createMany({
      data: urls.map((url, i) => ({ carId, url, position: existing + i })),
    });
    return this.findOne(carId);
  }

  async removeImage(
    ownerId: string,
    carId: string,
    imageId: string,
  ): Promise<CarDto> {
    await this.assertOwnership(carId, ownerId);
    const image = await this.prisma.carImage.findFirst({
      where: { id: imageId, carId },
    });
    if (image) {
      await this.prisma.carImage.delete({ where: { id: image.id } });
      await this.storage.remove(image.url);
    }
    return this.findOne(carId);
  }

  // ---- availability ----
  async listAvailability(carId: string) {
    return this.prisma.availability.findMany({
      where: { carId },
      orderBy: { startDate: "asc" },
    });
  }

  async addAvailabilityBlock(
    ownerId: string,
    carId: string,
    input: AvailabilityInput,
  ) {
    await this.assertOwnership(carId, ownerId);
    return this.prisma.availability.create({
      data: {
        carId,
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate),
      },
    });
  }

  async removeAvailabilityBlock(
    ownerId: string,
    carId: string,
    blockId: string,
  ) {
    await this.assertOwnership(carId, ownerId);
    await this.prisma.availability.deleteMany({
      where: { id: blockId, carId },
    });
    return { ok: true };
  }
}

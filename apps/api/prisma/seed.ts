import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const owners = [
  { phone: "99110011", name: "Бат-Эрдэнэ" },
  { phone: "99220022", name: "Сараа" },
  { phone: "99330033", name: "Тэмүүлэн" },
  { phone: "99440044", name: "Ганбаатар" },
  { phone: "99550055", name: "Энхжин" },
  { phone: "99660066", name: "Нямсүрэн" },
];

const cars = [
  { ownerPhone: "99110011", brand: "Toyota", name: "Land Cruiser 200", year: 2021, plateNumber: "1234 УБА", color: "Хар", category: "Жийп", transmission: "Автомат", fuel: "Дизель", seats: 7, pricePerDay: 280000, deposit: 500000, location: "Улаанбаатар, СБД", instantBook: true, features: ["4WD", "Камер", "Sunroof", "Apple CarPlay"] },
  { ownerPhone: "99220022", brand: "Toyota", name: "Prius 50", year: 2019, plateNumber: "2345 УБВ", color: "Цагаан", category: "Сэдан", transmission: "Автомат", fuel: "Гибрид", seats: 5, pricePerDay: 95000, deposit: 200000, location: "Улаанбаатар, ХУД", instantBook: true, features: ["Хямд шатахуун", "Камер", "Bluetooth"] },
  { ownerPhone: "99330033", brand: "Tesla", name: "Model 3", year: 2022, plateNumber: "3456 УБЕ", color: "Улаан", category: "Цахилгаан", transmission: "Автомат", fuel: "Цахилгаан", seats: 5, pricePerDay: 220000, deposit: 600000, location: "Улаанбаатар, БЗД", instantBook: false, features: ["Autopilot", "Том дэлгэц", "Хурдан цэнэг"] },
  { ownerPhone: "99440044", brand: "Lexus", name: "RX 350", year: 2020, plateNumber: "4567 УБӨ", color: "Мөнгөлөг", category: "Люкс", transmission: "Автомат", fuel: "Бензин", seats: 5, pricePerDay: 240000, deposit: 500000, location: "Улаанбаатар, СХД", instantBook: true, features: ["Арьсан суудал", "Камер", "Дулаан суудал"] },
  { ownerPhone: "99550055", brand: "Honda", name: "CR-V", year: 2018, plateNumber: "5678 УБХ", color: "Хөх", category: "SUV", transmission: "Автомат", fuel: "Бензин", seats: 5, pricePerDay: 150000, deposit: 300000, location: "Улаанбаатар, ЧД", instantBook: true, features: ["AWD", "Багтаамжтай", "Камер"] },
  { ownerPhone: "99660066", brand: "Toyota", name: "Camry 70", year: 2020, plateNumber: "6789 УБЯ", color: "Бор", category: "Сэдан", transmission: "Автомат", fuel: "Бензин", seats: 5, pricePerDay: 130000, deposit: 300000, location: "Улаанбаатар, БГД", instantBook: false, features: ["Тав тухтай", "Камер", "Bluetooth"] },
];

async function main() {
  // Админ
  await prisma.user.upsert({
    where: { phone: "99000000" },
    update: { isAdmin: true },
    create: { phone: "99000000", name: "Админ", isAdmin: true },
  });

  // Жишээ түрээслэгч
  await prisma.user.upsert({
    where: { phone: "99112233" },
    update: {},
    create: { phone: "99112233", name: "Болормаа" },
  });

  // Эзэд
  for (const o of owners) {
    await prisma.user.upsert({
      where: { phone: o.phone },
      update: { name: o.name },
      create: { phone: o.phone, name: o.name },
    });
  }

  // Машинууд (plateNumber-аар давхцлаас сэргийлнэ)
  for (const c of cars) {
    const owner = await prisma.user.findUnique({ where: { phone: c.ownerPhone } });
    if (!owner) continue;
    const exists = await prisma.car.findFirst({
      where: { plateNumber: c.plateNumber },
    });
    if (exists) continue;
    await prisma.car.create({
      data: {
        ownerId: owner.id,
        brand: c.brand,
        name: c.name,
        year: c.year,
        plateNumber: c.plateNumber,
        color: c.color,
        category: c.category,
        transmission: c.transmission,
        fuel: c.fuel,
        seats: c.seats,
        pricePerDay: c.pricePerDay,
        deposit: c.deposit,
        location: c.location,
        instantBook: c.instantBook,
        features: c.features,
        description: `${c.brand} ${c.name} — цэвэрхэн, бүрэн бүтэн. Хотын дотор болон хөдөө явахад тохиромжтой.`,
      },
    });
  }

  // eslint-disable-next-line no-console
  console.log("✅ Seed дууслаа. Админ: 99000000, Түрээслэгч: 99112233, Эзэд: 99110011..99660066 (OTP dev горимд консолд хэвлэгдэнэ)");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

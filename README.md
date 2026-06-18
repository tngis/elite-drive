# Elite Drive — Машин түрээсийн платформ

Хоёр талт зах зээл (renter ↔ owner). Монголд машинаа түрээслүүлж орлого олох, эсвэл
машин хайж түрээслэх. **Phase 1 (MVP) бүрэн ажиллаж байна.**

## Архитектур (monorepo)

```
apps/
  web/      # Next.js (App Router) — responsive web, TanStack Query
  api/      # NestJS REST API + Prisma + PostgreSQL
packages/
  types/    # zod schema + shared types (web ↔ api нэг эх сурвалж)
```

| Давхарга | Технологи |
|----------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind, shadcn/ui, TanStack Query |
| Backend  | NestJS, REST + Swagger/OpenAPI |
| DB       | PostgreSQL + Prisma (Docker) |
| Auth     | OTP (Mobicom SMS / Email) + JWT (access + refresh cookie) |
| Зураг    | Локал disk upload (R2/S3-д шилждэг абстракц) |

## Шаардлага

- Node 20+ , pnpm 11+
- Docker (PostgreSQL-д)

## Эхлүүлэх

```bash
# 1. Хамаарал суулгах
pnpm install

# 2. Shared types build (web/api хоёулаа хэрэглэнэ)
pnpm --filter @elite-drive/types build

# 3. PostgreSQL асаах (Docker)
pnpm db:up

# 4. Migration + seed өгөгдөл
pnpm db:migrate     # эхний удаа: schema → DB
pnpm db:seed

# 5. Backend + Frontend зэрэг асаах
pnpm dev
```

- Web: http://localhost:3000
- API: http://localhost:4000/api  (Swagger: http://localhost:4000/api/docs)

> Тусад нь асаах: `pnpm dev:api` , `pnpm dev:web`

## Орчны хувьсагч

`.env.example`-г харна уу. Үндсэн файлууд:
- `apps/api/.env` — DB, JWT, OTP, SMS/SMTP, upload
- `apps/web/.env.local` — `NEXT_PUBLIC_API_URL`

**OTP dev горим:** Mobicom/SMTP түлхүүр оруулаагүй үед код консолд хэвлэгдэж,
мөн нэвтрэх дэлгэц дээр "Демо код" болж харагдана. Жинхэнэ түлхүүр оруулмагц
автоматаар SMS/имэйл рүү илгээнэ (`apps/api/src/notifications/`).

## Demo бүртгэлүүд (seed)

OTP кодыг dev горимд авна (консол / дэлгэц).

| Үүрэг | Утас |
|-------|------|
| Админ | `99000000` |
| Түрээслэгч | `99112233` |
| Эзэд | `99110011` … `99660066` |

## Үндсэн flow (Phase 1)

- **Бүртгэл/нэвтрэх** — утас эсвэл имэйлээр OTP (passwordless)
- **Owner** — машин нэмэх/засах/идэвхгүй болгох/устгах, олон зураг, боломжгүй огноо блоклох
- **Renter** — хайх/шүүх/эрэмбэлэх, дэлгэрэнгүй, түрээсийн хүсэлт илгээх (үнийн задаргаа)
- **Захиалга** — pending → approved → active → completed / cancelled / rejected
- **Төлбөр** — гар арга (банк/QPay/SocialPay/бэлэн), статус баталгаажуулалт
- **Админ** — хэрэглэгч/машин/захиалга харах, блоклох/идэвхгүй болгох

## Хэрэгтэй командууд

```bash
pnpm typecheck      # бүх багц
pnpm build          # production build
pnpm db:studio      # Prisma Studio
pnpm db:down        # DB зогсоох
```

# Tech Stack — Машин түрээсийн платформ

> Зорилго: Монголын хамгийн том машин түрээсийн платформ болтол **scale хийх боломжтой, ирээдүйтэй** архитектур.
> Үндсэн зарчим: **API-first, TypeScript бүхэлд нь, monorepo.**

---

## 0. Гол зарчмууд (architecture principles)

1. **API-first** — Backend нь web-ээс тусдаа. Web болон ирээдүйн mobile app **нэг API**-г хэрэглэнэ. Server Actions-д бизнес логик битгий бич.
2. **TypeScript everywhere** — web, backend, shared types бүгд TS. Frontend↔backend хооронд type аюулгүй.
3. **Relational + ACID** — захиалга, огноо давхцал, мөнгөн гүйлгээ заавал PostgreSQL дээр. NoSQL ашиглахгүй.
4. **Stateless backend** — JWT-д тулгуурласан, horizontal scale хийдэг.
5. **Background jobs эртхэн** — алданги, мэдэгдэл, deadline сануулга = queue (Redis/BullMQ).

---

## 1. Одоогийн үе (Phase 1) — Responsive website

| Давхарга | Технологи |
|----------|-----------|
| Framework | **Next.js (App Router)** |
| Хэл | **TypeScript** |
| UI | **shadcn/ui** + **Tailwind CSS** |
| Серверийн төлөв / data fetch | **TanStack Query** (client) + Server Components (read) |
| Форм | **react-hook-form** + **zod** |
| Icon | **lucide-react** |
| Хэлбэр шалгалт | **zod** (frontend + backend хуваалцана) |
| Lint/Format | **ESLint + Prettier** |
| Package manager | **pnpm** |

> Phase 1-д зөвхөн responsive web. Backend болон mobile хараахан барихгүй, гэхдээ доорх архитектурт нийцүүлж бэлдэнэ.

---

## 2. Бүрэн зорилтот stack (Phase 2+ нэмэгдэнэ)

| Давхарга | Технологи | Хэзээ | Яагаад |
|----------|-----------|-------|--------|
| **Backend** | **NestJS** (TypeScript) | Phase 1 төгсгөл / Phase 2 | Модульчилсан, scale хийдэг, web-тэй type хуваалцана |
| **API** | **REST + OpenAPI** | Phase 1 төгсгөл | Mobile / 3rd party-д нээлттэй, type автоматаар |
| **DB** | **PostgreSQL + Prisma** (PostGIS) | Phase 1 төгсгөл | ACID гүйлгээ, газрын зураг хайлт |
| **Cache / Queue** | **Redis + BullMQ** | Phase 2 | Алданги, мэдэгдэл, deadline job |
| **Auth** | **OTP (SMS) + JWT** (access/refresh) | Phase 1 төгсгөл | Утас = хэрэглэгч, stateless |
| **Зураг** | **Cloudflare R2 / S3** + CDN | Phase 1 төгсгөл | Машины олон зураг хямд |
| **Төлбөр** | **QPay** → SocialPay → карт → escrow | Phase 1→3 | Монголд QPay заавал |
| **Search** | Postgres → **Meilisearch** | Phase 3 | Эхэндээ DB хангалттай |
| **Push** | **Expo Push / FCM** | Phase 2 | Мэдэгдэл |
| **Mobile** | **PWA → Capacitor → React Native** | Phase 1→3 | Web кодоо ашиглаж хурдан гарна |
| **Monorepo** | **Turborepo + pnpm workspaces** | Phase 2 | web/mobile/api/shared нэг repo |
| **Infra** | Railway/Render → **AWS/GCP (Docker)** | Phase 1→3 | Хямд эхэлж scale-д шилжих зам нээлттэй |
| **Observability** | Sentry + структурлсан лог | Phase 2 | Алдаа хяналт |

---

## 3. Зорилтот monorepo бүтэц (Phase 2-оос)

```
apps/
  web/         # Next.js (App Router)  — одоо эхэлж байгаа
  mobile/      # Capacitor / React Native (дараа нь)
  api/         # NestJS backend (дараа нь)
packages/
  ui/          # shadcn components хуваалцах
  types/       # zod schema + shared types (web↔api)
  config/      # eslint/tsconfig/tailwind preset
```

> Phase 1-д энгийн нэг Next.js апп-аар эхэлнэ, гэхдээ дотоод фолдер бүтцийг дээрх руу хялбар шилждэг байдлаар цэгцэлнэ.

---

## 4. Mobile стратеги (тогтсон)

| Phase | Mobile |
|-------|--------|
| Phase 1 | Зөвхөн **responsive web (PWA-д бэлэн)** |
| Phase 2 | **Capacitor**-аар Next.js-ээ store-д гаргах |
| Phase 3-4 | Хэрэгцээ батлагдвал гол flow-г **React Native** руу |

> Тиймээс web-ийг эхнээсээ **client-rendered боломжтой, API-аас өгөгдөл татдаг** байдлаар бич (Server Actions-д хэт түшиглэхгүй) — ингэвэл Capacitor дотор SPA болж ажиллана.

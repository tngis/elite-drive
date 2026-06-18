# Development Rules — Машин түрээсийн платформ

> Бүх хөгжүүлэлтэд мөрдөх дүрэм. Зорилго: scale хийхэд эвдрэхгүй, цэвэр, нэгдмэл код.

---

## 1. Ерөнхий зарчим

- **TypeScript strict mode** заавал. `any` хэрэглэхгүй (зайлшгүй бол `unknown` + zod).
- **API-first** — UI-д бизнес логик битгий бич. Өгөгдөл API/service давхаргаас ирнэ.
- **zod schema нэг эх сурвалж** — форм, API request/response бүгд zod-оор validate.
- Файл нэрлэлт: `kebab-case` (фолдер/файл), компонент `PascalCase`.
- Нэг компонент = нэг үүрэг. 200+ мөр болвол хуваа.

## 2. Folder бүтэц (Next.js App Router)

```
src/
  app/                # routes (App Router)
  components/
    ui/               # shadcn компонентууд (генерат)
    shared/           # дахин ашиглагдах компонент
  features/           # домэйнаар: cars/, booking/, auth/ ...
    cars/
      components/
      hooks/
      api.ts          # энэ домэйны API дуудлага
      types.ts        # zod schema + types
  lib/                # утилит, тохиргоо (api client, utils)
  hooks/              # глобал hooks
  styles/
```

- Домэйн логикийг `features/<domain>/` дотор төвлөрүүл. `app/` зөвхөн routing + layout.

## 3. Styling (Tailwind + shadcn)

- **Tailwind utility ашигла.** Custom CSS зөвхөн зайлшгүй үед.
- Өнгө/зай/радиусыг **Tailwind theme token**-оор (hardcode хийхгүй). Брэнд өнгийг `tailwind.config` дотор тодорхойл.
- shadcn компонентыг шууд засахгүй — `components/ui`-д үлдээж, дээр нь wrapper хий.
- **Responsive заавал**: mobile-first. `sm: md: lg:` breakpoint-оор бүх дэлгэцэнд шалга.
- Dark mode-д бэлэн байх (CSS variable, `next-themes`).

## 4. Data fetching

- **Read (жагсаалт, дэлгэрэнгүй)**: Server Component эсвэл TanStack Query.
- **Mutation (хүсэлт, бүртгэл)**: TanStack Query `useMutation` → API client.
- **Бүх API дуудлага нэг `lib/api-client.ts`-ээр** (fetch wrapper: base URL, auth header, алдаа боловсруулалт).
- Server Actions-д бизнес логик БИТГИЙ бич (Capacitor-д ажиллахгүй). Зөвхөн API руу проксилох бол зүгээр.

## 5. Форм ба validation

- `react-hook-form` + `zodResolver`.
- zod schema-г `features/<domain>/types.ts`-д тодорхойлж, форм болон API хоёулаа ашигла.
- Алдааны мессеж Монгол хэлээр, төвлөрсөн.

## 6. Git (repo үүсгэсний дараа)

- Branch: `main` (production), `dev` (integration), feature: `feat/<name>`, fix: `fix/<name>`.
- `main`-д шууд push хийхгүй — PR-аар.
- Commit: **Conventional Commits** (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`).
- Жижиг, утга бүхий commit.

## 7. Чанар

- PR-аас өмнө: `pnpm lint` + `pnpm typecheck` цэвэр байх.
- Нэрлэлт ойлгомжтой, англиар (UI текст Монголоор).
- Magic number/string-ийг `constants.ts`-д.
- `// TODO:`-д шалтгаан бич.

## 8. Орчны хувьсагч

- Нууцыг кодод битгий бич. `.env.local` ашигла, `.env.example`-д түлхүүр нэрсийг тэмдэглэ.
- Client-д ил гарах хувьсагч зөвхөн `NEXT_PUBLIC_` угтвартай.

## 9. Хүртээмж ба гүйцэтгэл

- Зураг `next/image`-ээр, lazy load.
- Семантик HTML, `alt`, фокус, keyboard navigation.
- Lighthouse: performance & accessibility 90+ зорилт.

## 10. Хэл (i18n-д бэлэн)

- UI текстийг hardcode хийхээс зайлсхий — Phase 1-д Монгол default, гэхдээ текстийг нэг газар цуглуул (дараа i18n амар).

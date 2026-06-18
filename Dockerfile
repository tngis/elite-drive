# Elite Drive API (NestJS) — Railway/Render зэрэг тасралтгүй сервер платформд.
# Build context = repo root (monorepo: packages/types + apps/api хэрэгтэй).
FROM node:22-slim

# Prisma-д openssl шаардлагатай
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN corepack enable

WORKDIR /app

# Бүх monorepo-г хуулна (.dockerignore-оор node_modules/.next/dist хасагдана)
COPY . .

# Хамаарал суулгах + types build + prisma generate + api build
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @elite-drive/types build
RUN pnpm --filter @elite-drive/api prisma:generate
RUN pnpm --filter @elite-drive/api build

ENV NODE_ENV=production
EXPOSE 4000

# Start: migration хэрэгжүүлээд серверийг асаана
CMD ["sh", "-c", "pnpm --filter @elite-drive/api prisma:deploy && node apps/api/dist/main.js"]

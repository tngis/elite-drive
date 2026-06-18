# Deploy — Elite Drive

| Хэсэг | Платформ | Тайлбар |
|-------|----------|---------|
| **Web** (apps/web) | **Vercel** | Next.js — төгс тохирно |
| **API** (apps/api) | **Railway** (эсвэл Render) | NestJS — тасралтгүй сервер (Dockerfile-аар) |
| **DB** | **Neon** | аль хэдийн үүссэн (Singapore) |
| **Зураг** | **Cloudflare R2** | аль хэдийн холбогдсон |

> Дараалал: **① API (Railway) → ② Web (Vercel) → ③ API-ийн WEB_ORIGIN-ийг шинэчлэх**

---

## ① API — Railway

1. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo** → `tngis/elite-drive`
2. Railway нь root дахь **Dockerfile**-ийг автоматаар ашиглана (API build хийнэ).
3. **Variables** хэсэгт дараахийг тавь:

```
NODE_ENV=production
DATABASE_URL=<Neon-ийн direct connection string, ?sslmode=require>
WEB_ORIGIN=https://<таны-vercel-домэйн>.vercel.app
API_PUBLIC_URL=https://<railway-домэйн>.up.railway.app
JWT_ACCESS_SECRET=<урт санамсаргүй мөр>
JWT_REFRESH_SECRET=<өөр урт санамсаргүй мөр>
JWT_ACCESS_TTL=900
JWT_REFRESH_TTL_DAYS=30
OTP_TTL_SEC=300
OTP_DEV_MODE=true
R2_ACCOUNT_ID=<...>
R2_ACCESS_KEY_ID=<...>
R2_SECRET_ACCESS_KEY=<...>
R2_BUCKET=elite-drive
R2_PUBLIC_URL=https://pub-xxxx.r2.dev
```

4. Deploy дуусахад Railway public домэйн өгнө (Settings → Networking → Generate Domain). Энэ нь **API-ийн хаяг**.
   - Health шалгах: `https://<railway>/api/health`

> Container эхлэхдээ `prisma migrate deploy` автоматаар ажиллаж Neon дээр хүснэгт үүсгэнэ.
> Seed хэрэгтэй бол Railway-ийн shell дээр: `pnpm --filter @elite-drive/api prisma:seed`

---

## ② Web — Vercel

1. [vercel.com](https://vercel.com) → **Add New → Project** → `tngis/elite-drive` импортлох
2. **Root Directory** = `apps/web`
3. Build тохиргоо: Vercel нь `vercel-build` script-ийг ашиглана (types-ийг эхэлж build хийдэг).
4. **Environment Variables**:

```
NEXT_PUBLIC_API_URL=https://<railway-API-домэйн>.up.railway.app
```

5. Deploy → Vercel домэйн өгнө (ж: `elite-drive.vercel.app`).

---

## ③ Холболтыг бүрэн болгох

1. Railway-ийн **WEB_ORIGIN**-ийг Vercel-ийн жинхэнэ домэйнгээр шинэчилж дахин deploy хий (CORS-д шаардлагатай).
2. Дуусгаад вэб дээр нэвтрэлт (OTP), машин хайх, захиалга ажиллахыг шалга.

## Cross-domain cookie (анхаарах)

Web (`vercel.app`) ↔ API (`railway.app`) нь өөр домэйн тул refresh cookie нь
production-д автоматаар **`SameSite=None; Secure`** болж тохируулагдсан
(`NODE_ENV=production` үед). Хоёулаа https байх ёстой — Vercel/Railway аль аль нь https.

> Хэрэв нэг үндсэн домэйнд тавих бол (ж: `elitedrive.mn` + `api.elitedrive.mn`),
> SameSite=Lax-аар ч ажиллана.

## Жинхэнэ OTP (дараа)

Одоо `OTP_DEV_MODE=true` тул код дэлгэцэнд харагдана. Mobicom SMS / SMTP түлхүүр
авбал тэдгээрийг Railway env-д тавьж `OTP_DEV_MODE=false` болгоно.

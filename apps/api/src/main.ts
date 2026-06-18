import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import { join } from "node:path";
import { existsSync, mkdirSync } from "node:fs";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const webOrigin = process.env.WEB_ORIGIN ?? "http://localhost:3000";
  app.enableCors({ origin: webOrigin.split(","), credentials: true });
  app.use(cookieParser());
  app.setGlobalPrefix("api");

  // Локал зургийн static хавтас
  const uploadDir = join(process.cwd(), process.env.UPLOAD_DIR ?? "uploads");
  if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });
  app.useStaticAssets(uploadDir, { prefix: "/uploads/" });

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Elite Drive API")
    .setDescription("Машин түрээсийн платформ — Phase 1 REST API")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api/docs", app, document);

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`🚗 Elite Drive API → http://localhost:${port}/api  (docs: /api/docs)`);
}

void bootstrap();

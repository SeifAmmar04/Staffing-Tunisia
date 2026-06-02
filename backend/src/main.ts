import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import 'dotenv/config';

async function bootstrap() {
  // ✅ NestExpressApplication (pas juste NestFactory.create)
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

 app.enableCors({
  origin: [
    'http://localhost:3000',
    'https://staffing-tunisia-trmu.vercel.app',
    'https://staffing-tunisia-trmu-7ddkrjr3z.vercel.app',
  ],
  credentials: true,
});

  // ✅ Servir le dossier uploads en statique
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  await app.listen(5000);
  console.log("🚀 Server running on http://localhost:5000");
}
bootstrap();

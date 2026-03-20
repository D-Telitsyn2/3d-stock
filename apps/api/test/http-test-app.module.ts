import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '../src/app.controller';
import { AssetsModule } from '../src/assets/assets.module';
import { HealthModule } from '../src/health/health.module';
import { PrismaModule } from '../src/prisma/prisma.module';

/**
 * Обрезанное приложение для HTTP-тестов без Users/Clerk-цикла и без чтения .env с диска.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      load: [
        () => ({
          CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ?? '',
          DATABASE_URL: process.env.DATABASE_URL ?? '',
        }),
      ],
    }),
    PrismaModule,
    HealthModule,
    AssetsModule,
  ],
  controllers: [AppController],
})
export class HttpTestAppModule {}

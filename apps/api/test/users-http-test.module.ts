import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../src/auth/auth.module';
import { PrismaModule } from '../src/prisma/prisma.module';
import { UsersModule } from '../src/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      load: [
        (): Record<string, string> => ({
          CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ?? '',
          DATABASE_URL: process.env.DATABASE_URL ?? '',
        }),
      ],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
  ],
})
export class UsersHttpTestModule {}

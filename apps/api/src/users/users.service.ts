import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Clerk } from '@clerk/backend';
import { PrismaService } from '../prisma/prisma.service';
import type { UserMeDto } from './dto/user-me.dto';

type ClerkClient = ReturnType<typeof Clerk>;

@Injectable()
export class UsersService {
  private clerk: ClerkClient | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    const secretKey = this.config.get<string>('CLERK_SECRET_KEY');
    if (secretKey) {
      this.clerk = Clerk({ secretKey });
    }
  }

  async syncAndGetMe(clerkUserId: string): Promise<UserMeDto> {
    if (!this.clerk) {
      throw new InternalServerErrorException('Clerk is not configured');
    }

    let cu: Awaited<ReturnType<ClerkClient['users']['getUser']>>;
    try {
      cu = await this.clerk.users.getUser(clerkUserId);
    } catch {
      throw new BadGatewayException('Failed to load user from Clerk');
    }

    const primary =
      cu.emailAddresses.find(e => e.id === cu.primaryEmailAddressId) ??
      cu.emailAddresses[0];
    const email = primary?.emailAddress;
    if (!email) {
      throw new InternalServerErrorException('Clerk user has no email');
    }

    const user = await this.prisma.user.upsert({
      where: { externalId: clerkUserId },
      create: {
        externalId: clerkUserId,
        email,
        firstName: cu.firstName ?? null,
        lastName: cu.lastName ?? null,
      },
      update: {
        email,
        firstName: cu.firstName ?? null,
        lastName: cu.lastName ?? null,
      },
    });

    return {
      id: user.id,
      externalId: user.externalId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verifyToken } from '@clerk/backend';
import type { Request } from 'express';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const secretKey = this.config.get<string>('CLERK_SECRET_KEY');
    if (!secretKey) {
      throw new ServiceUnavailableException(
        'CLERK_SECRET_KEY is not configured; protected routes are disabled',
      );
    }

    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = header.slice('Bearer '.length).trim();
    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    try {
      const { sub } = await verifyToken(token, { secretKey, issuer: null });
      if (!sub) {
        throw new UnauthorizedException('Invalid token payload');
      }
      req.clerkUserId = sub;
      return true;
    } catch (e) {
      if (e instanceof UnauthorizedException || e instanceof ServiceUnavailableException) {
        throw e;
      }
      throw new UnauthorizedException('Invalid or expired session');
    }
  }
}

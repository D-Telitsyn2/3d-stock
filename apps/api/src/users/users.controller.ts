import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { UserMeDto } from './dto/user-me.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth('clerk-jwt')
  @ApiOperation({
    summary: 'Current user (sync from Clerk → DB)',
    description:
      'Send `Authorization: Bearer <Clerk session JWT>`. Upserts `users` row by Clerk id.',
  })
  @ApiResponse({ status: 200, type: UserMeDto })
  @ApiUnauthorizedResponse({ description: 'Missing/invalid token' })
  async me(@Req() req: Request): Promise<UserMeDto> {
    return this.usersService.syncAndGetMe(req.clerkUserId!);
  }
}

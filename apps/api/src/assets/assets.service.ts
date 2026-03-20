import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { PublicAssetDto } from './dto/public-asset.dto';

@Injectable()
export class AssetsService {
  constructor(private readonly prisma: PrismaService) {}

  async listPublished(page: number, limit: number): Promise<{
    items: PublicAssetDto[];
    page: number;
    limit: number;
    total: number;
  }> {
    const skip = (page - 1) * limit;
    const where = { status: 'PUBLISHED' };

    const [total, rows] = await Promise.all([
      this.prisma.asset.count({ where }),
      this.prisma.asset.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          slug: true,
          title: true,
          description: true,
          priceCents: true,
          currency: true,
          previewReady: true,
          createdAt: true,
        },
      }),
    ]);

    const items: PublicAssetDto[] = rows.map(r => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    }));

    return { items, page, limit, total };
  }
}

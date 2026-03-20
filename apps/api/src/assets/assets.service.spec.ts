import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { AssetsService } from './assets.service';

describe('AssetsService', () => {
  const findMany = vi.fn();
  const count = vi.fn();

  let service: AssetsService;

  beforeEach(async () => {
    vi.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [AssetsService],
    })
      .overrideProvider(PrismaService)
      .useValue({
        asset: { findMany, count },
      })
      .compile();

    service = moduleRef.get(AssetsService);
  });

  it('listPublished maps rows and applies skip/take', async () => {
    const d = new Date('2025-06-15T12:00:00.000Z');
    count.mockResolvedValueOnce(42);
    findMany.mockResolvedValueOnce([
      {
        id: 'x',
        slug: 's',
        title: 'T',
        description: 'D',
        priceCents: 500,
        currency: 'EUR',
        previewReady: false,
        createdAt: d,
      },
    ]);

    const out = await service.listPublished(3, 5);

    expect(out).toEqual({
      items: [
        {
          id: 'x',
          slug: 's',
          title: 'T',
          description: 'D',
          priceCents: 500,
          currency: 'EUR',
          previewReady: false,
          createdAt: d.toISOString(),
        },
      ],
      page: 3,
      limit: 5,
      total: 42,
    });

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 10,
        take: 5,
        where: { status: 'PUBLISHED' },
      }),
    );
  });
});

import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaService } from '../src/prisma/prisma.service';
import { HttpTestAppModule } from './http-test-app.module';
import { UsersHttpTestModule } from './users-http-test.module';

describe('HTTP API — catalog & health (Prisma mocked)', () => {
  const findMany = vi.fn();
  const count = vi.fn();

  const mockPrisma = {
    asset: { findMany, count },
    user: {
      upsert: vi.fn(),
      findUnique: vi.fn(),
    },
    $connect: vi.fn().mockResolvedValue(undefined),
    $disconnect: vi.fn().mockResolvedValue(undefined),
  };

  let app: import('@nestjs/common').INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HttpTestAppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    const nestApp = moduleRef.createNestApplication();
    nestApp.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await nestApp.init();
    app = nestApp;
  });

  afterAll(async () => {
    await app?.close();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /health returns JSON status', async () => {
    const res = await request(app.getHttpServer()).get('/health').expect(200);
    expect(res.body).toMatchObject({
      status: 'ok',
      service: '3D Stock API',
    });
    expect(res.body.timestamp).toBeDefined();
  });

  it('GET /health.txt returns plain text', async () => {
    const res = await request(app.getHttpServer()).get('/health.txt').expect(200);
    expect(res.text).toMatch(/^ok\n3D Stock API\n/);
  });

  it('GET / returns HTML with API hints', async () => {
    const res = await request(app.getHttpServer()).get('/').expect(200);
    expect(res.text).toContain('3D Stock API');
    expect(res.text).toContain('/api/docs');
  });

  it('GET /assets returns paginated published assets', async () => {
    const created = new Date('2025-01-01T00:00:00.000Z');
    count.mockResolvedValueOnce(1);
    findMany.mockResolvedValueOnce([
      {
        id: 'a1',
        slug: 'test-asset',
        title: 'Test',
        description: 'Desc',
        priceCents: 1000,
        currency: 'EUR',
        previewReady: true,
        createdAt: created,
      },
    ]);

    const res = await request(app.getHttpServer()).get('/assets?page=1&limit=10').expect(200);

    expect(res.body).toEqual({
      items: [
        {
          id: 'a1',
          slug: 'test-asset',
          title: 'Test',
          description: 'Desc',
          priceCents: 1000,
          currency: 'EUR',
          previewReady: true,
          createdAt: created.toISOString(),
        },
      ],
      page: 1,
      limit: 10,
      total: 1,
    });

    expect(count).toHaveBeenCalledWith({ where: { status: 'PUBLISHED' } });
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { status: 'PUBLISHED' },
        skip: 0,
        take: 10,
      }),
    );
  });

  it('GET /assets uses default pagination when query omitted', async () => {
    count.mockResolvedValueOnce(0);
    findMany.mockResolvedValueOnce([]);

    await request(app.getHttpServer()).get('/assets').expect(200);

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 20,
      }),
    );
  });
});

describe('HTTP API — /users/me auth (Prisma mocked)', () => {
  const mockPrisma = {
    asset: { findMany: vi.fn(), count: vi.fn() },
    user: { upsert: vi.fn(), findUnique: vi.fn() },
    $connect: vi.fn().mockResolvedValue(undefined),
    $disconnect: vi.fn().mockResolvedValue(undefined),
  };

  let app: import('@nestjs/common').INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UsersHttpTestModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    const nestApp = moduleRef.createNestApplication();
    nestApp.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await nestApp.init();
    app = nestApp;
  });

  afterAll(async () => {
    await app?.close();
  });

  it('GET /users/me without Authorization returns 401', async () => {
    await request(app.getHttpServer()).get('/users/me').expect(401);
  });

  it('GET /users/me with invalid bearer returns 401', async () => {
    await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', 'Bearer not-a-real-jwt')
      .expect(401);
  });
});

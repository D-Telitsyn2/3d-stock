import { describe, expect, it } from 'vitest';
import { PaginatedPublicAssetsSchema } from './catalog';

describe('PaginatedPublicAssetsSchema', () => {
  it('parses valid API-shaped payload', () => {
    const parsed = PaginatedPublicAssetsSchema.parse({
      items: [
        {
          id: '1',
          slug: 'a',
          title: 'T',
          description: 'D',
          priceCents: 100,
          currency: 'EUR',
          previewReady: true,
          createdAt: '2025-01-01T00:00:00.000Z',
        },
      ],
      page: 1,
      limit: 20,
      total: 1,
    });
    expect(parsed.total).toBe(1);
    expect(parsed.items[0].slug).toBe('a');
  });

  it('rejects invalid payload', () => {
    expect(() =>
      PaginatedPublicAssetsSchema.parse({
        items: [{ id: 1 }],
        page: 1,
        limit: 20,
        total: 0,
      } as unknown),
    ).toThrow();
  });
});

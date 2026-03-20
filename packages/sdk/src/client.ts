import { PaginatedPublicAssetsSchema, type PaginatedPublicAssets } from '@repo/schema';

export function createApiClient(baseUrl: string) {
  const root = baseUrl.replace(/\/$/, '');

  return {
    async listAssets(params?: { page?: number; limit?: number }): Promise<PaginatedPublicAssets> {
      const u = new URL(`${root}/assets`);
      if (params?.page != null) u.searchParams.set('page', String(params.page));
      if (params?.limit != null) u.searchParams.set('limit', String(params.limit));

      const res = await fetch(u.toString(), {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) {
        throw new Error(`API request failed: ${res.status} ${res.statusText}`);
      }
      const json: unknown = await res.json();
      return PaginatedPublicAssetsSchema.parse(json);
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;

import { z } from 'zod';

export const PublicAssetSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  priceCents: z.number(),
  currency: z.string(),
  previewReady: z.boolean(),
  createdAt: z.string(),
});

export const PaginatedPublicAssetsSchema = z.object({
  items: z.array(PublicAssetSchema),
  page: z.number(),
  limit: z.number(),
  total: z.number(),
});

export type PublicAsset = z.infer<typeof PublicAssetSchema>;
export type PaginatedPublicAssets = z.infer<typeof PaginatedPublicAssetsSchema>;

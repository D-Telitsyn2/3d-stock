import type { PaginatedPublicAssets, PublicAsset } from '@repo/schema';

export type { PaginatedPublicAssets, PublicAsset };

export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
}

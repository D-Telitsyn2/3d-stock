import { z } from 'zod';

export const AssetStatusSchema = z.enum(['DRAFT', 'SUBMITTED', 'PUBLISHED', 'REJECTED']);
export const LicenseSchema = z.enum(['STANDARD', 'EXTENDED']);
export const CurrencySchema = z.enum(['EUR', 'USD', 'GBP']);

export const CreateAssetSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(2000),
  priceCents: z.number().min(100), // Minimum €1.00
  currency: CurrencySchema.default('EUR'),
  tags: z.array(z.string()).optional(),
});

export const UpdateAssetSchema = CreateAssetSchema.partial();

export type CreateAssetInput = z.infer<typeof CreateAssetSchema>;
export type UpdateAssetInput = z.infer<typeof UpdateAssetSchema>;
export type AssetStatus = z.infer<typeof AssetStatusSchema>;
export type License = z.infer<typeof LicenseSchema>;
export type Currency = z.infer<typeof CurrencySchema>;

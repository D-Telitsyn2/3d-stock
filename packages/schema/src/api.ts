import { z } from 'zod';

export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
});

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};

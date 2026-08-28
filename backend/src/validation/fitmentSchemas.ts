import { z } from 'zod';

export const fitmentCreateSchema = z.object({
  partNumber: z.string().min(1).max(64),
  make: z.string().min(1).max(64),
  model: z.string().min(1).max(64),
  yearStart: z.number().int().min(1900).max(2100),
  yearEnd: z.number().int().min(1900).max(2100),
  trim: z.string().max(64).nullable().optional(),
  engine: z.string().max(64).nullable().optional(),
  driveType: z.string().max(16).nullable().optional(),
  bodyType: z.string().max(32).nullable().optional(),
  source: z.string().max(32).optional(),
});

export const fitmentUpdateSchema = fitmentCreateSchema.partial();

export const fitmentSearchSchema = z.object({
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.coerce.number().int().optional(),
  partNumber: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(200).optional(),
});

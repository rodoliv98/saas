import { z } from 'zod';

export const paymentSchema = z.object({
  data: z.object({
    id: z.string(),
    amount: z.number(),
    status: z.string(),
    devMode: z.boolean(),
    brCode: z.string(),
    brCodeBase64: z.string(),
    platformFee: z.number(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    expiresAt: z.coerce.date()
  }),
  error: z.string()
});

export const allowedPlans = z.enum(
  [
    'Básico',
    'Intermediário',
    'Pro'
  ], { message: 'Plano inválido' }
);
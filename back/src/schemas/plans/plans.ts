import { z } from 'zod';

const planPriceSchema = z.object({
  monthly: z.object({
      price: z.number(),
      months: z.number()
    }),
  annually: z.object({
    price: z.number(),
    months: z.number(),
    discount: z.number()
  })
});

const basicPlanFeaturesSchema = z.object({
  reports: z.string(),
  support: z.string(),
  kdsSystem: z.string(),
  orderLimit: z.string(),
  digitalMenu: z.string(),
  telegramBot: z.string(),
});

export const basicPlanSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: planPriceSchema,
  features: basicPlanFeaturesSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
});
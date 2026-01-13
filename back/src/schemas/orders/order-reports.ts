import { z } from 'zod';

export const orderReportSchema = z.object({
  year: z.number(),
  month: z.number(),
  status: z.enum(['concluido', 'cancelado'], { message: 'Status inválido' })
});
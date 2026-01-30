import { z } from 'zod';
// falta validação
export const tenantReportSchema = z.object({
  year: z.number(),
  month: z.number(),
  status: z.enum(['concluido', 'cancelado'], { message: 'Status inválido' })
});
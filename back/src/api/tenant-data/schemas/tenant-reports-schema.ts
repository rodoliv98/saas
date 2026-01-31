import { z } from 'zod';

export const tenantReportSchema = z.object({
  year: z.number()
         .int({ message: 'Ano deve ser um número inteiro' })
         .min(2026, { message: 'Ano deve ser no mínimo 2026' })
         .max(2030, { message: 'Ano deve ser no máximo 2030' }),
  month: z.number()
          .int({ message: 'Mês deve ser um número inteiro' })
          .min(1, { message: 'Mês deve ser no mínimo 1' })
          .max(12, { message: 'Mês deve ser no máximo 12' }),
  status: z.enum(
    ['concluido', 'cancelado'],
    { message: 'Status inválido' })
});
import { z } from 'zod';

export const orderStatusSchema = z.enum(
  [
    'pendente', 
    'preparando', 
    'pronto', 
    'entregando', 
    'concluido', 
    'cancelado'
  ], { message: 'Status fornecido está inválido' }
);
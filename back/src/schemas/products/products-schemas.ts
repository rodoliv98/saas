import { z } from 'zod';


export const defaultRegex = /^[a-zA-ZáàâãäéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ0-9$ ,.\-]{0,200}$/;

export const cuidSchema = z.string({ message: 'CUID deve ser uma string' })
                           .min(24)
                           .max(25)
                           .regex(/^[a-z0-9]{24,25}$/, "CUID inválido")
                           .trim();

export const productSchema = z.object({
  id: cuidSchema,
  nomeProduto: z.string({ message: 'Nome do produto deve ser uma string' })
                .min(1, 'Nome do produto está faltando')
                .max(100, 'Nome do produto está muito longo')
                .regex(defaultRegex, 'Não são permitidos simbolos no campo nome do produto')
                .trim(),
  descProduto: z.string({ message: 'Descrição do produto deve ser uma string' })
                .min(1, 'Descrição do produto está faltando')
                .max(200, 'Descrição do produto está muito longo')
                .regex(defaultRegex, 'Não são permitidos simbolos no campo descrição do produto')
                .trim(),
  categoria: z.string({ message: 'Categoria do produto deve ser uma string' })
              .min(1, 'Categoria está faltando')
              .max(14, 'Categoria deve conter apenas 14 caracteres')
              .regex(/^[a-z][a-z_]{1,14}$/, 'Não são permitidos simbolos no campo categoria')
              .trim(),
  quantidade: z.number({ message: 'Quantidade deve ser um número' })
               .min(1, 'Quantidade deve ser no mínimo 1')
               .max(100, 'Quantidade deve ser no máximo 100')
               .refine(val => Number.isInteger(val), 'Quantidade deve ser um número inteiro'),
  precoProduto: z.number({ message: 'Preço do produto deve ser um número' })
                 .min(0, 'Preço do produto deve ser no mínimo 0.01')
                 .max(10000, 'Preço do produto deve ser no máximo 10.000')
                 .refine(val => Number.isInteger(Math.round(val * 100)), 'Preço do produto deve ter no máximo duas casas decimais'),
  totalPrice: z.number({ message: 'Preço total do produto deve ser um número' })
               .min(1, 'Preço total do produto deve ser no mínimo 0.01')
               .max(100000, 'Preço total do produto deve ser no máximo 100.000')
               .refine(val => Number.isInteger(Math.round(val * 100)), 'Preço total do produto deve ter no máximo duas casas decimais'),
  imageUrl: z.string({ message: 'Imagem do produto deve ser uma URL válida' })
             .min(1, 'Imagem do produto está faltando')
             .max(200, 'Imagem do produto está muito longa')
             .regex(/^https?:\/\/[^\s\/$.?#].[^\s]*\.(jpg|jpeg|png|gif|webp|svg)(\?[^\s#]*)?$/i, 'URL inválida')
             .trim()
});

export const createProductSchema = z.object({
  nomeProduto: productSchema.shape.nomeProduto,
  categoria: productSchema.shape.categoria,
  descProduto: productSchema.shape.descProduto,
  precoProduto: productSchema.shape.precoProduto
});


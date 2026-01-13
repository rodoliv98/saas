import { z } from 'zod';
import { productSchema, defaultRegex } from '../products/products-schemas';

function reUseValidation (message = {}) {
  const defaultMessages = {
    min: 'Mínimo desse campo é 1',
    max: 'Máximo desse campo é 100',
    regex: 'Simbolos não são permitidos nesse campo'
  };

  const modifiedMessages = { ...defaultMessages, ...message };

  return z.string()
          .min(1, modifiedMessages.min)
          .max(100, modifiedMessages.max)
          .regex(defaultRegex, modifiedMessages.regex)
          .trim()
}

export const orderSchema = z.object({
  nomeCompleto: reUseValidation({
    min: 'Nome é obrigatório',
    max: 'Número máximo de caracteres para o campo Nome Completo é 100',
    regex: 'Nome deve conter apenas letras, espaços e acentos'
  }),
  endereco: reUseValidation({
    min: 'Endereço é obrigatório',
    max: 'Número máximo de caracteres para o campo Endereço é 100',
    regex: 'Endereço deve conter apenas letras, números, espaços e hifens'
  }),
  bairro: reUseValidation({
    min: 'Bairro é obrigatório',
    max: 'Número máximo de caracteres para o campo Bairro é 100',
    regex: 'Bairro deve conter apenas letras, espaços e acentos'
  }),
  cep: z.string()
        .min(10, 'CEP deve ter pelo menos 8 digitos')
        .max(10, 'CEP deve ter no máximo 8 digitos')
        .regex(/^\d{2}\.\d{3}-\d{3}$/, 'Formato do CEP deve ser XXXXX-XX')
        .trim(),
  numero: z.string()
           .min(1, 'Número é obrigatório')
           .max(4, 'Número deve conter no máximo 4 caracteres')
           .regex(/^\d{1,4}$/, 'Número deve conter apenas números')
           .trim(),
  complemento: z.string()
                .max(100, 'Número máximo de caracteres para o campo Complemento é 100')
                .trim()
                .regex(defaultRegex, 'Só são permitidos letras, números, vígulas e pontos no campo Complemento')
                .optional(),
  whatsapp: z.string()
             .min(14, 'Número de telefone deve ter o formato (XX) XXXX-XXXX')
             .max(15, 'Número de telefone deve ter o formato (XX) XXXXX-XXXX')
             .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Número de telefone no formato inválido')
             .trim(),
  items: z.array(z.object({
    id: productSchema.shape.id,
    nomeProduto: productSchema.shape.nomeProduto,
    descProduto: productSchema.shape.descProduto,
    categoria: productSchema.shape.categoria,
    quantidade: productSchema.shape.quantidade,
    precoProduto: productSchema.shape.precoProduto, 
    totalPrice: productSchema.shape.totalPrice, 
    imageUrl: productSchema.shape.imageUrl,

    adicionais: z.array(z.object({
      id: productSchema.shape.id,
      nomeProduto: productSchema.shape.nomeProduto,
      descProduto: productSchema.shape.descProduto,
      categoria: productSchema.shape.categoria,
      precoProduto: productSchema.shape.precoProduto
    }))

  })),
  tenantSlug: reUseValidation({
    min: '???',
    max: '???',
    regex: '???'
  }),
  formaPagamento: z.enum(['cartao', 'pix', 'dinheiro'], { message: 'Forma de pagamento inválida' }),
  tipoEntrega: z.enum(['delivery', 'retirada'], { message: 'Tipo de entrega inválida' }),
  taxaEntrega: z.number()
                .min(0, 'Taxa de entrega não pode ser negativa')
                .max(999.99, 'Taxa de entrega muito alta')
                .refine((val) => Number.isInteger(Math.round(val * 100)), 'Taxa de entrega deve ter no máximo duas casas decimais'),
  observacao: z.string()
               .max(100, 'Número máximo de caracteres para o campo Observação é 100')
               .trim()
               .regex(defaultRegex, 'Só são permitidos letras, números, vígulas e pontos no campo observação')
               .optional(),
  totalOrderPrice: productSchema.shape.totalPrice
});
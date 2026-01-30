import { z } from 'zod';
import { defaultRegex } from '../products/products-schemas';


export const slugSchema = z.string()
                    .min(5, 'Domínio deve ter no mínimo 5 caracteres')
                    .max(100, 'Domínio deve ter no máximo 100 caracteres')
                    .regex(/^[a-zA-ZáàâãäéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ0-9-]{5,100}$/, 'É permitido apenas letras maiúsculas, minúsculas, números e hifens')
                    .trim();

export const registerSchema = z.object({
  // passo 1
  nomeFantasia: z.string()
                 .trim()
                 .max(100, 'Nome fantasia muito longo')
                 .transform(val => val === '' ? null : val)
                 .nullable()
                 .refine(val => val === null || defaultRegex.test(val), 'Nome fantasia inválido'),
  razaoSocial: z.string({ message: 'Razão social é obrigatória' })
                .min(1, 'Razão social está faltando')
                .max(100, 'Razão social muito longo')
                .regex(defaultRegex, 'Razão social inválida')
                .trim(),
  inscricaoEstadual: z.string()
                      .trim()
                      .max(100, 'Inscrição estadual muito longa')
                      .transform(val => val === '' ? null : val)
                      .nullable()
                      .refine(val => val === null || /^[0-9\.]{1,100}$/.test(val), 'Inscrição estadual inválida'),
  CNPJ: z.string()
         .min(18, 'CNPJ muito curto')
         .max(18, 'CNPJ muito longo')
         .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/, 'Números e simbolos não são permitidos no CNPJ')
         .trim(),
  // passo 2
  nomeRepresentante: z.string()
                      .min(1, 'Nome do representante está faltando')
                      .max(50, 'Excesso de caracteres em Nome do Representante')
                      .regex(defaultRegex, 'Nome deve conter apenas letras e espaços')
                      .trim(),
  CPF: z.string()
        .min(14, 'CPF deve conter no mínimo 11 digitos')
        .max(14, 'CPF deve conter no máximo 14 digitos')
        .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato XXX.XXX.XXX-XX')
        .trim(),
  email: z.string({ message: 'Email é obrigatório' }).email({ message: 'Formato de email inválido' }),
  senha: z.string()
          .min(10, "Senha deve ter pelo menos 10 caracteres")
          .max(30, "Senha deve ter no máximo 30 caracteres")
          .regex(/^(?=.*[a-z])/, "Senha Deve conter pelo menos uma letra minúscula")
          .regex(/^(?=.*[A-Z])/, "Senha Deve conter pelo menos uma letra maiúscula") 
          .regex(/^(?=.*\d)/, "Senha Deve conter pelo menos um número")
          .regex(/^(?=.*[!@#$%^&*()_+\-=[\]{}|;:,.?])/, "Senha Deve conter pelo menos um símbolo")
          .regex(/^[a-zA-Z\d!@#$%^&*()_+\-=[\]{}|;:,.?]+$/, "Caracteres não permitidos no campo Senha")
          .refine((val) => !/[<>'"\\]/.test(val), "Caracteres < > ' \" \\ não são permitidos no campo Senha"),
  telefone: z.string()
             .min(14, 'Número de telefone deve ter o formato (XX) XXXX-XXXX')
             .max(15, 'Número de telefone deve ter o formato (XX) XXXXX-XXXX')
             .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Número de telefone no formato inválido')
             .trim(),
  // passo 3
  CEP: z.string()
        .min(10, 'CEP deve ter pelo menos 8 digitos')
        .max(10, 'CEP deve ter no máximo 8 digitos')
        .regex(/^\d{2}\.\d{3}-\d{3}$/, 'Formato do CEP deve ser XXXXX-XX')
        .trim(),
  bairro: z.string()
           .min(3, 'Bairro está faltando')
           .max(30, 'Bairro deve conter no máximo 30 caracteres')
           .regex(defaultRegex, 'Bairro não deve conter nenhum tipo de simbolo')
           .trim(),
  municipio: z.string()
              .min(3, 'Município está faltando')
              .max(30, 'Município deve conter no máximo 30 caracteres')
              .regex(defaultRegex, 'Município não deve conter nenhum tipo de simbolo')
              .trim(),
  complemento: z.string()
                .trim()
                .max(100, 'Complemento deve conter no máximo 100 caracteres')
                .transform(val => val === '' ? null : val)
                .nullable()
                .refine(val => val === null || /^[a-zA-ZÀ-ÿ\s-]{1,100}$/.test(val), 'O campo Complemento não deve conter nenhum tipo de simbolo'),
  endereco: z.string()
             .min(5, 'Endereço deve ser mais específico')
             .max(50, 'Endereço deve conter apenas 50 caracteres')
             .regex(defaultRegex, 'Endereço não deve conter nenhum tipo de simbolo')
             .trim(),
  numero: z.string()
           .min(1, 'Número está faltando')
           .max(10, 'Número deve ter no máximo 10 caracteres')
           .regex(/^\d{2,10}$/, 'O campo Número deve conter apenas números sem espaços')
           .trim(),
  estado: z.string()
           .min(2, 'Estado deve conter pelo menos 2 letras')
           .max(2, 'Estado deve conter no máximo 2 letras')
           .trim()
           .regex(/^[A-Z]{2}$/, 'Estado deve conter apenas 2 caracteres'),
  // passo 4
  tenantSlug: slugSchema,
  diasFuncionamento: z.array(
    z.string()
    .trim()
    .regex(/^[a-z]{3}$/, 'Selecione por favor os dias de funcionamento')
  ),
  horarioFuncionamento: z.string()
                         .min(11, 'O horario de funcionamento deve estar no formato XX:XX-XX:XX')
                         .max(11, 'O horario de funcionamento deve estar no formato XX:XX-XX:XX')
                         .trim()
                         .regex(/^\d{2}:\d{2}-\d{2}:\d{2}$/, 'Horario de funcionamento deve ter o formato XX:XX-XX:XX'),
  tempoPreparo: z.string()
                 .min(1)
                 .max(3)
                 .regex(/^\d{1,3}$/, 'O campo Tempo de Preparo deve conter apenas números')
                 .trim(),
  taxaEntrega: z.number()
                .min(0, 'Taxa de entrega não pode ser negativa')
                .max(999.99, 'Taxa de entrega muito alta')
                .refine((val) => Number.isInteger(Math.round(val * 100)), 'Taxa de entrega deve ter no máximo duas casas decimais'),
  whatsapp: z.string()
             .min(14, 'Número de telefone deve ter o formato (XX) XXXX-XXXX')
             .max(15, 'Número de telefone deve ter o formato (XX) XXXXX-XXXX')
             .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Número de telefone no formato inválido')
             .trim()
});

export const tenantIsOpen = z.object({ isStoreOpen: z.boolean() });

export const userRegisterSchema = z.object({
  nomeCompleto: registerSchema.shape.nomeRepresentante,
  email: registerSchema.shape.email,
  senha: registerSchema.shape.senha
});
import { z } from 'zod';

export const adminLoginSchema = z.object({
  email: z.string({ message: 'Email é obrigatório' })
          .email({ message: 'Formato de email inválido' }),
  senha: z.string()
          .min(10, "Senha deve ter pelo menos 10 caracteres")
          .max(30, "Senha deve ter no máximo 30 caracteres")
          .regex(/^(?=.*[a-z])/, "Senha Deve conter pelo menos uma letra minúscula")
          .regex(/^(?=.*[A-Z])/, "Senha Deve conter pelo menos uma letra maiúscula") 
          .regex(/^(?=.*\d)/, "Senha Deve conter pelo menos um número")
          .regex(/^(?=.*[!@#$%^&*()_+\-=[\]{}|;:,.?])/, "Senha Deve conter pelo menos um símbolo")
          .regex(/^[a-zA-Z\d!@#$%^&*()_+\-=[\]{}|;:,.?]+$/, "Você usou caracteres que não permitidos no campo Senha")
          .refine((val) => !/[<>'"\\]/.test(val), "Caracteres < > ' \" \\ não são permitidos no campo Senha")
});

export const storeStatusSchema = z.object({
	tenantId: z.string()
						 .regex(/^[a-z0-9]{25,26}$/, { message: 'ID inválido' }),
	storeOpenStatus: z.boolean()
});

export const storeActiveStatusSchema = z.object({
	tenantId: z.string()
						 .regex(/^[a-z0-9]{25,26}$/, { message: 'ID inválido' }),
	tenantActiveStatus: z.boolean()
});
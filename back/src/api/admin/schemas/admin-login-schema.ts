import { z } from 'zod';

export const adminLoginSchema = z.object({
  username: z.string({ message: 'Username tem que ser uma string' })
             .regex(/^[a-zA-Z]{4,15}$/, 'Username tem que ter entre 4 e 15 caracteres')
             .trim(),
  senha: z.string()
          .min(10, "Senha deve ter pelo menos 10 caracteres")
          .max(30, "Senha deve ter no máximo 30 caracteres")
          .regex(/^(?=.*[a-z])/, "Senha Deve conter pelo menos uma letra minúscula")
          .regex(/^(?=.*[A-Z])/, "Senha Deve conter pelo menos uma letra maiúscula") 
          .regex(/^(?=.*\d)/, "Senha Deve conter pelo menos um número")
          .regex(/^(?=.*[!@#$%^&*()_+\-=[\]{}|;:,.?])/, "Senha Deve conter pelo menos um símbolo")
          .regex(/^[a-zA-Z\d!@#$%^&*()_+\-=[\]{}|;:,.?]+$/, "Você usou caracteres que não permitidos no campo Senha")
          .refine((val) => !/[<>'"\\]/.test(val), "Caracteres < > ' \" \\ não são permitidos no campo Senha")
})
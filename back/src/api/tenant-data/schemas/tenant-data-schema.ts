import { z } from "zod";
import { registerSchema } from "../../../schemas/users/user-schemas";

export const patchTenantDataSchema = registerSchema
  .pick({
    endereco: true,
    numero: true,
    complemento: true,
    bairro: true,
    municipio: true,
    estado: true,
    horarioFuncionamento: true,
    diasFuncionamento: true,
    tempoPreparo: true,
    whatsapp: true
  }).extend({
    pin: z.string()
          .regex(/^\d{6}$/, 'O campo PIN deve conter apenas 6 digitos')
          .or(z.literal(''))
});
import { z } from "zod";
import { registerSchema } from "../../../schemas/users/user-schemas";

export const userRegisterSchema = z.object({
  nomeCompleto: registerSchema.shape.nomeRepresentante,
  email: registerSchema.shape.email,
  senha: registerSchema.shape.senha
});
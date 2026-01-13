import { registerSchema } from "../../../schemas/users/user-schemas";

export const loginSchema = registerSchema.pick({
  email: true,
  senha: true
});
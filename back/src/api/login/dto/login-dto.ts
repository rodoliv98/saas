import { loginSchema } from "../schemas/login-schema";
import { z } from "zod";

export type LoginDTO = z.infer<typeof loginSchema>;
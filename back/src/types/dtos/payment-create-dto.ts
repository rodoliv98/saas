import { allowedPlans, paymentSchema } from "../../schemas/payments/payment-create";
import { z } from "zod";

export type PaymentCreateDTO = z.infer<typeof paymentSchema>;
export type AllowedPlans = z.infer<typeof allowedPlans>;
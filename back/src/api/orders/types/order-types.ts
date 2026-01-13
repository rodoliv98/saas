import { orderSchema } from "../../../schemas/orders/order-schemas";
import { z } from 'zod';

export type OrderSchema = z.infer<typeof orderSchema>;
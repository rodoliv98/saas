import { registerSchema, slugSchema, userRegisterSchema } from "../schemas/users/user-schemas";
import { orderSchema } from "../schemas/orders/order-schemas";
import { orderStatusSchema } from "../api/orders/schemas/order-schema";
import { cuidSchema } from "../schemas/products/products-schemas";
import { z } from "zod";
import { BasicPlanFeatures, Plan } from "./entities/plan-entitie";
//import { AbacateQrCodeCreationResponseFail, AbacateQrCodeCreationResponseSuccess } from "./externals/abacate/qr-code-creation";

// login and register types
export type RegisterType = z.infer<typeof registerSchema>;
export type UserRegisterType = z.infer<typeof userRegisterSchema>;
export type IdType = {
  table: 'users' | 'tenant' | 'admins',
  id: string;
}

// order types
export type OrderSchema = z.infer<typeof orderSchema>;
export type PedidoStatus = z.infer<typeof orderStatusSchema>;

// tenant and other types
export type Cuid = z.infer<typeof cuidSchema>;
export type SlugType = z.infer<typeof slugSchema>;
export type ActivationCodeDTO = {
  code: string;
  tenant_id: string;
  utilizado: boolean;
  expire_date: Date;
}

// payment types
export type AnyPlan = Plan<BasicPlanFeatures>;
/* export type AbacateQrCodeResponse = 
| AbacateQrCodeCreationResponseSuccess
| AbacateQrCodeCreationResponseFail */
import { registerSchema, slugSchema } from "../schemas/users/user-schemas";
import { userRegisterSchema } from "../api/user-register/schemas/user-register-schema";
import { orderSchema } from "../schemas/orders/order-schemas";
import { orderStatusSchema } from "../api/orders/schemas/order-schema";
import { cuidSchema } from "../schemas/products/products-schemas";
import { z } from "zod";

// login and register types
export type RegisterType = z.infer<typeof registerSchema>;
export type UserRegisterType = z.infer<typeof userRegisterSchema>;
export type TableName = {
  table: 'users' | 'tenant' | 'admins',
  id: string;
}
export type IdType = 'userId' | 'tenantId' | 'adminId';
export type RoleType = 'user' | 'tenant' | 'admin';

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
import { Admins, Prisma } from "../../../generated/prisma/client";

export type TenantAdminView = Prisma.TenantGetPayload<{
  select: {
    id: true,
    tenantSlug: true,
    isOpen: true,
    active: true,
    diasFuncionamento: true,
    horarioFuncionamento: true
  }
}>

export type AdminRefresh = Prisma.AdminsGetPayload<{
  select: { id: true }
}> & {
  role: 'admin'
}

export type Admin = Omit<Admins, 'createdAt'>;

export type ActiveStatusResult = 
| "A conta do tenant foi ativada" 
| "A conta do tenant foi desativada"

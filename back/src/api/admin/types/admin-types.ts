import { Prisma } from "../../../generated/prisma/client";

export type TenantAdminView = Prisma.TenantGetPayload<{
  select: {
    id: true,
    tenantSlug: true,
    isOpen: true
  }
}>

export type AdminRefresh = Prisma.AdminsGetPayload<{
  select: { id: true }
}> & {
  role: 'admin'
}
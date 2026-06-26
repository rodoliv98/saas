import { Tenant, Prisma } from "../../../generated/prisma/client";
import prisma from "../../../lib/prisma/prisma";

export type TenantStoreInfo = Pick<Tenant, 'isOpen' | 'tenantSlug' | 'logoUrl' | 'bannerUrl'>;

const args = {
  include: {
    produtos: {
      include: {
        sabores: true
      }
    }
  },
} satisfies Prisma.TenantDefaultArgs;

export type TenantWithProducts = Prisma.TenantGetPayload<typeof args>;
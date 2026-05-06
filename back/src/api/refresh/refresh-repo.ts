import { PrismaClient } from "../../generated/prisma/client";
import { TenantRefresh } from "../login/entities/tenant";
import { UserRefresh } from "../login/entities/user";
import { TableName } from "../../types/types-index";
import { AdminRefresh } from "../admin/types/admin-types";

export interface IRefreshRepository {
  refresh (id: TableName): Promise<TenantRefresh | UserRefresh | AdminRefresh | null>;
}

export class RefreshRepository implements IRefreshRepository {
  constructor (private prisma: PrismaClient) {}
  
  async refresh (tokenId: TableName) {
    switch (tokenId.table) {
      case "users":
        const user = await this.prisma.users.findFirst({
          where: { id: tokenId.id },
          select: { id: true }
        });

        if (!user) return null;
        return { ...user, role: 'user' } as UserRefresh;

      case "tenant":
        const tenant = await this.prisma.tenant.findFirst({
          where: { id: tokenId.id },
          select: { id: true, tenantSlug: true }
        });

        if (!tenant) return null;
        return { ...tenant, role: 'tenant' } as TenantRefresh;
      
        case "admins":
        const admin = await this.prisma.admins.findFirst({
          where: { id: tokenId.id },
          select: { id: true }
        });

        if (!admin) return null;
        return { ...admin, role: 'admin' } as AdminRefresh;
      
      default:
        return null;
    } 
  }
}
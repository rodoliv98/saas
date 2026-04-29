import { PrismaClient } from "../../generated/prisma/client";
import { TenantAdminView } from "./types/admin-types";
import { Admins, Tenant } from "../../generated/prisma/client";

export interface IAdminRepository {
  login (data: { username: string, senha: string }): Promise<Admins | null>;
  findAllTenants (): Promise<TenantAdminView[]>;
  findTenant (tenantId: string): Promise<Tenant | null>;
  changeStoreStatus (tenantId: string, newStatus: boolean): Promise<Tenant>;
}

export class AdminRepository implements IAdminRepository {
  constructor (private readonly prisma: PrismaClient) {}

  async login (data: { username: string, senha: string }) {
    return this.prisma.admins.findUnique({
      where: {
        username: data.username
      }
    });
  }

  async findAllTenants () {
    return this.prisma.tenant.findMany({
      select: {
        id: true,
        tenantSlug: true,
        isOpen: true
      }
    });
  }

  async findTenant (tenantId: string) {
    return this.prisma.tenant.findUnique({
      where: {
        id: tenantId
      }
    })
  }
 
  async changeStoreStatus (tenantId: string, newStatus: boolean) {
    return this.prisma.tenant.update({
      where: {
        id: tenantId
      },
      data: {
        isOpen: newStatus
      }
    })
  }
}
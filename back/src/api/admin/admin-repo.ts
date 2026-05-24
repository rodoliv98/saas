import { PrismaClient } from "../../generated/prisma/client";
import { Admin, TenantAdminView } from "./types/admin-types";
import { Tenant } from "../../generated/prisma/client";

export interface IAdminRepository {
  login (data: { email: string, senha: string }): Promise<Admin | null>;
  findAllTenants (): Promise<TenantAdminView[]>;
  findTenant (tenantId: string): Promise<Tenant | null>;
  changeStoreStatus (tenantId: string, newStatus: boolean): Promise<Tenant>;
  changeStoreActiveStatus (tenantId: string, newActiveStatus: boolean): Promise<Tenant>;
}

export class AdminRepository implements IAdminRepository {
  constructor (private readonly prisma: PrismaClient) {}

  async login (data: { email: string, senha: string }) {
    return this.prisma.admins.findUnique({
      where: {
        email: data.email
      }
    });
  }

  async findAllTenants () {
    return this.prisma.tenant.findMany({
      select: {
        id: true,
        tenantSlug: true,
        isOpen: true,
        active: true,
        diasFuncionamento: true,
        horarioFuncionamento: true
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
 
  async changeStoreStatus (tenantId: string, storeOpenStatus: boolean) {
    return this.prisma.tenant.update({
      where: {
        id: tenantId
      },
      data: {
        isOpen: storeOpenStatus
      }
    })
  }
  
  async changeStoreActiveStatus (tenantId: string, tenantActiveStatus: boolean) {
    return this.prisma.tenant.update({
      where: {
        id: tenantId
      },
      data: {
        active: tenantActiveStatus
      }
    })
  }
}
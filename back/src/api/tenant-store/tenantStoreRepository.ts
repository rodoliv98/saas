import { PrismaClient } from "../../generated/prisma/client"
import { ProductsWithFlavors } from "../product/entities/product-entitie";
import { Tenant } from "../../generated/prisma/client";
import { CustomError } from "../../errors/errorHandler";
import { DeliveryCode } from "../../types/entities/delivery-code-entitie";
import { ActivationCodeDTO, SlugType } from "../../types/types-index";
import { TenantStoreInfo, TenantWithProducts } from "./entities/store-entitie";

export interface ITenantStoreRepository {
  getData (slug: SlugType): Promise<TenantWithProducts | null>;
  getProducts (id: string): Promise<ProductsWithFlavors[] | []>;
  isOpen (id: string): Promise<TenantStoreInfo | null>;
  patchIsOpen (data: boolean, tenantId: string): Promise<Tenant>;
  createDeliveryCode (activationCode: ActivationCodeDTO): Promise<DeliveryCode>;
}

export class TenantStoreRepository implements ITenantStoreRepository {
  constructor (private readonly prisma: PrismaClient) {}

  async getData (slug: SlugType) {
    return this.prisma.tenant.findFirst({
      where: {
        tenantSlug: slug 
      },
      include: {
        produtos: {
          include: {
            sabores: true
          }
        }
      }
    });
  }

  async getProducts (id: string) {
    return this.prisma.produtos.findMany({
      where: {
        tenantId: id
      },
      include: {
        sabores: true
      }
    });
  }

  async isOpen (id: string) {
    return this.prisma.tenant.findFirst({
      where: {
        id: id
      },
      select: {
        isOpen: true,
        tenantSlug: true,
        logoUrl: true,
        bannerUrl: true
      }
    });
  }

  async patchIsOpen (data: boolean, tenantId: string) {
    try {
      return this.prisma.tenant.update({
        where: {
          id: tenantId
        },
        data: {
          isOpen: data
        }
      });
      
    } catch (err) {
      if ((err as any).code === 'P2025') {
        throw new CustomError('Tenant não encontrado', 404, 'TENANT_NOT_FOUND');
      }

      throw err;
    }
  }
  
  async createDeliveryCode (activationCode: ActivationCodeDTO) {
    return this.prisma.codigos_Ativacao.create({
      data: {
        codigo: activationCode.code,
        tenant_id: activationCode.tenant_id,
        utilizado: activationCode.utilizado,
        created_at: new Date(),
        expire_date: activationCode.expire_date
      }
    })
  }
}
import { Decimal } from "@prisma/client/runtime/library";
import { PrismaClient } from "../generated/prisma/client";
import { IFlavor } from "../controllers/tenantFlavorsController";
import { Cuid } from "../types/types-index";
import { CustomError } from "../errors/errorHandler";
import { PatchFlavorDTO } from "../api/tenant-flavor/dto/tenant-flavor-dto";
import { Flavor } from "../api/tenant-flavor/entitie/flavor-entitie";
import { PatchFlavorData, FlavorImageData, CreateFlavorData } from "../api/tenant-flavor/types/tenant-flavor-types";

export interface ITenantFlavorsRepository {
  getFlavors (productId: string): Promise<IFlavor[] | []>;
  getFlavorById (flavorId: string, tenantId: string): Promise<IFlavor | null>;
  findFlavor (data: PatchFlavorDTO): Promise<FlavorImageData | null> | null;
  create (flavorData: CreateFlavorData): Promise<IFlavor>;
  patch (data: PatchFlavorData, flavorId: string): Promise<Flavor>;
  delete (productId: Cuid, tenantId: string): Promise<DeletedFlavor>;
}

export interface DeletedFlavor {
  id: string;
  produtoId: string;
  nomeProduto: string;
  descProduto: string;
  categoria: string;
  precoProduto: Decimal;
  imageUrl: string;
}

export class TenantFlavorsRepository implements ITenantFlavorsRepository {
  constructor (private readonly prisma: PrismaClient) {}

  async getFlavors (productId: string) {
    return this.prisma.sabores.findMany({
      where: {
        produtoId: productId
      }
    }); 
  }

  async getFlavorById (flavorId: string, tenantId: string) {
    return this.prisma.sabores.findFirst({
      where: {
        tenantId: tenantId,
        id: flavorId
      }
    });
  }

  async findFlavor (data: PatchFlavorDTO) {
    return this.prisma.sabores.findFirst({
      where: {
        id: data.flavorId,
        tenantId: data.tenantId
      },
      select: {
        imageUrl: true,
        imagePublicId: true,
      }
    });    
  }

  async create (flavorData: CreateFlavorData) {
    return this.prisma.sabores.create({
      data: {
        nomeProduto: flavorData.nomeProduto,
        descProduto: flavorData.descProduto,
        precoProduto: flavorData.precoProduto,
        categoria: flavorData.categoria,
        imageUrl: flavorData.imageUrl,
        imagePublicId: flavorData.imagePublicId,
        produtoId: flavorData.productId,
        tenantId: flavorData.tenantId
      }
    })
  }

  async patch (data: CreateFlavorData, flavorId: string) {
    return this.prisma.sabores.update({
      where: {
        id: flavorId
      },
      data: {
        ...data
      }
    });
  }
  
  async delete (productId: Cuid, tenantId: string) {
    const flavor = await this.prisma.sabores.findFirst({
      where: {
        id: productId,
        tenantId: tenantId
      }
    });

    if (!flavor) {
      throw new CustomError('Sabor não encontrado', 404, 'FLAVOR_NOT_FOUND');
    }
    
    return await this.prisma.sabores.delete({
      where: {
        id: productId
      }
    });
  }
}
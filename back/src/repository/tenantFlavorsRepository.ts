import { Decimal } from "@prisma/client/runtime/library";
import { PrismaClient } from "../generated/prisma/client";
import { FlavorDTO, IFlavor } from "../controllers/tenantFlavorsController";
import { Cuid } from "../types/types-index";
import { CustomError } from "../middlewares/errorHandler";
import { PatchFlavorDTO } from "../api/tenant-flavor/dto/tenant-flavor-dto";
import { Flavor } from "../api/tenant-flavor/entitie/flavor-entitie";

export interface ITenantFlavorsRepository {
  getFlavors (productId: string): Promise<IFlavor[] | []>;
  getFlavorById (flavorId: string, tenantId: string): Promise<IFlavor | null>;
  findFlavor (data: Partial<PatchFlavorDTO>): Promise<Flavor | null>;
  create (data: FlavorDTO, productId: Cuid, tenantId: string): Promise<IFlavor>;
  patch (data: PatchFlavorDTO): Promise<Flavor>;
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

const prisma = new PrismaClient();

export class TenantFlavorsRepository implements ITenantFlavorsRepository {
  async getFlavors (productId: string) {
    return prisma.sabores.findMany({
      where: {
        produtoId: productId
      }
    }); 
  }

  async getFlavorById (flavorId: string, tenantId: string) {
    return prisma.sabores.findFirst({
      where: {
        tenantId: tenantId,
        id: flavorId
      }
    });
  }

  async findFlavor (data: Partial<PatchFlavorDTO>) {
    return prisma.sabores.findFirst({
      where: {
        id: data.flavorId,
        tenantId: data.tenantId
      }
    });    
  }

  async create (data: FlavorDTO, productId: Cuid, tenantId: string) {
    return prisma.sabores.create({
      data: {
        nomeProduto: data.nomeProduto,
        descProduto: data.descProduto,
        precoProduto: data.precoProduto,
        categoria: data.categoria,
        imageUrl: data.imageUrl,
        produtoId: productId,
        tenantId: tenantId
      }
    })
  }

  async patch (data: PatchFlavorDTO) {
    return prisma.sabores.update({
      where: {
        id: data.flavorId
      },
      data: {
        ...data.data
      }
    });
  }
  
  async delete (productId: Cuid, tenantId: string) {
    const flavor = await prisma.sabores.findFirst({
      where: {
        id: productId,
        tenantId: tenantId
      }
    });

    if (!flavor) {
      throw new CustomError('Sabor não encontrado', 404, 'FLAVOR_NOT_FOUND');
    }
    
    return await prisma.sabores.delete({
      where: {
        id: productId
      }
    });
  }
}
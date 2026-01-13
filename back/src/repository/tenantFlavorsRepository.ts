import { Decimal } from "@prisma/client/runtime/library";
import { PrismaClient } from "../generated/prisma/client";
import { FlavorDTO, IFlavor } from "../controllers/tenantFlavorsController";
import { Cuid } from "../types/types-index";
import { CustomError } from "../middlewares/errorHandler";

export interface ITenantFlavorsRepository {
  getFlavors (productId: string): Promise<IFlavor[] | []>;
  getFlavorById (flavorId: string, tenantId: string): Promise<IFlavor | null>;
  create (data: FlavorDTO, productId: Cuid, tenantId: string): Promise<IFlavor>;
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
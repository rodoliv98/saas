import { PrismaClient } from "../generated/prisma/client"
import { IPatchProductDTO } from "../controllers/tenantProductsController"
import { IProdutos, ProductDTO } from "../controllers/tenantProductsController";
import { CustomError } from "../middlewares/errorHandler";

export interface ITenantProductsRepository {
  getProducts (id: string): Promise<IProdutos[] | []>;
  getProductById (productId: string, tenantId: string): Promise<IProdutos | null>;
  create (product: ProductDTO, imageUrl: string): Promise<IProdutos>;
  patch (product: IPatchProductDTO, productId: string, tenantId: string): Promise<IProdutos | null>;
  delete (id: string, tenantId: string): Promise<IProdutos | null>;
}

const prisma = new PrismaClient();

export class TenantProductsRepository implements ITenantProductsRepository {
  async getProducts (id: string): Promise<IProdutos[]> {
    return prisma.produtos.findMany({
      where: {
        tenantId: id
      }
    });
  }

  async getProductById (productId: string, tenantId: string): Promise<IProdutos | null> {
    return prisma.produtos.findFirst({
      where: {
        id: productId,
        tenantId: tenantId
      }
    });
  }
  
  async create (product: ProductDTO, imageUrl: string): Promise<IProdutos> {
    return prisma.produtos.create({
      data: {
        nomeProduto: product.nomeProduto,
        descProduto: product.descProduto,
        categoria: product.categoria,
        precoProduto: product.precoProduto,
        imageUrl: imageUrl,
        tenantId: product.tenantId
      }
    });
  }

  async patch (updatedProduct: IPatchProductDTO, productId: string, tenantId: string): Promise<IProdutos | null> {
    const product = await prisma.produtos.findFirst({
      where: {
        tenantId: tenantId,
        id: productId
      }
    });

    if (!product) {
      throw new CustomError('Produto não encontrado', 404, 'PRODUCT_NOT_FOUND');
    }

    return prisma.produtos.update({
      where: {
        id: productId
      },
      data: {
        ...updatedProduct
      }
    });
  }

  async delete (id: string, tenantId: string): Promise<IProdutos | null> {
    const product = await prisma.produtos.findFirst({
      where: {
        tenantId: tenantId,
        id: id
      }
    });

    if (!product) throw new CustomError('Produto não encontrado', 404, 'PRODUCT_NOT_FOUND');

    return await prisma.produtos.delete({
      where: {
        id: id
      }
    });
  }
}
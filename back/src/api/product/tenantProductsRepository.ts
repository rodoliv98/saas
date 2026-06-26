import { PrismaClient, Produtos } from "../../generated/prisma/client";
import { ProductDTO } from "./tenantProductsController";
import { CustomError } from "../../errors/errorHandler";
import { CloudinaryImageResult } from "../../integrations/cloudinary/cloudinary-types";
import { CreateProductData } from "./types/product-types";

export interface ITenantProductsRepository {
  getProducts (id: string): Promise<Produtos[] | []>;
  getProductById (productId: string, tenantId: string): Promise<Produtos | null>;
  create (product: ProductDTO, cloudinaryData: CloudinaryImageResult): Promise<Produtos>;
  patch (productData: CreateProductData): Promise<void>;
  delete (id: string, tenantId: string): Promise<Produtos | null>;
}

export class TenantProductsRepository implements ITenantProductsRepository {
  constructor (private readonly prisma: PrismaClient) {}
  
  async getProducts (id: string) {
    return this.prisma.produtos.findMany({
      where: {
        tenantId: id
      }
    });
  }

  async getProductById (productId: string, tenantId: string) {
    return this.prisma.produtos.findFirst({
      where: {
        id: productId,
        tenantId: tenantId
      }
    });
  }
  
  async create (product: ProductDTO, cloudinaryData: CloudinaryImageResult) {
    return this.prisma.produtos.create({
      data: {
        nomeProduto: product.nomeProduto,
        descProduto: product.descProduto,
        categoria: product.categoria,
        precoProduto: product.precoProduto,
        imageUrl: cloudinaryData.url,
        imagePublicId: cloudinaryData.public_id,
        tenantId: product.tenantId
      }
    });
  }

  async patch (productData: CreateProductData) {
    await this.prisma.produtos.update({
      where: {
        id: productData.productId
      },
      data: {
        nomeProduto: productData.nomeProduto,
        descProduto: productData.descProduto,
        categoria: productData.categoria,
        precoProduto: productData.precoProduto,
        imageUrl: productData.imageUrl,
        imagePublicId: productData.imagePublicId
      }
    });

    return;
  }

  async delete (id: string, tenantId: string) {
    const product = await this.prisma.produtos.findFirst({
      where: {
        tenantId: tenantId,
        id: id
      }
    });

    if (!product) throw new CustomError('Produto não encontrado', 404, 'PRODUCT_NOT_FOUND');

    return await this.prisma.produtos.delete({
      where: {
        id: id
      }
    });
  }
}
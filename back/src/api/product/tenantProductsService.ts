import { ProductDTO } from "./dto/product-dto";
import { Produtos } from "../../generated/prisma/client";
import { ITenantProductsRepository } from "./tenantProductsRepository";
import { FormatProductById, FormatProductsData } from "./interfaces/products-interfaces";
import { uploadToCloudinary } from "../../integrations/cloudinary/cloudinary-upload";
import { CustomError } from "../../errors/errorHandler";
import { ErrorCode } from "../../types/constants/error-codes-constants";
import { PatchProductDTO } from "./dto/product-dto";

export interface ITenantProductsService {
  getProducts (id: string): Promise<FormatProductsData[] | []>;
  getProductById (productId: string, tenantId: string): Promise<FormatProductById>;
  create (product: ProductDTO): Promise<Produtos>;
  patch (productData: PatchProductDTO): Promise<void>;
  delete (id: string, tenantId: string): Promise<Produtos | null>;
}

export class TenantProductsService implements ITenantProductsService {
  constructor (private repo: ITenantProductsRepository) {}

  async getProducts (id: string) {
    const products = await this.repo.getProducts(id);

    const formatedProducts = this.formatProductsData(products);
    return formatedProducts;
  }

  async getProductById (productId: string, tenantId: string) {
    const product = await this.repo.getProductById(productId, tenantId);
    if (!product) {
      throw new CustomError('Produto não encontrado', 404, ErrorCode.PRODUCT_NOT_FOUND);
    }

    const formatedProduct = this.formatProductById(product);
    return formatedProduct;
  }
  
  async create (product: ProductDTO) {
    const cloudinaryData = await uploadToCloudinary(
      product.imagePath, 
      null, 
      product.tenantSlug
    );
    const createdProduct = await this.repo.create(product, cloudinaryData);

    return createdProduct;
  }

  async patch (productData: PatchProductDTO) {
    const foundProduct = await this.repo.getProductById(productData.productId, productData.tenantId);
    if (!foundProduct) {
      throw new CustomError('Produto não encontrado', 404, ErrorCode.PRODUCT_NOT_FOUND);
    }

    if (productData.multerImagePath) {
      const cloudinaryData = await uploadToCloudinary(
        productData.multerImagePath, 
        foundProduct.imagePublicId,
        productData.tenantSlug
      );
      const updateProductData = {
        nomeProduto: productData.nomeProduto,
        descProduto: productData.descProduto,
        categoria: productData.categoria,
        precoProduto: productData.precoProduto,
        imageUrl: cloudinaryData.url,
        imagePublicId: cloudinaryData.public_id,
        tenantId: productData.tenantId,
        productId: productData.productId
      };

      await this.repo.patch(updateProductData);
      return;
    }

    const updateProductData = {
      nomeProduto: productData.nomeProduto,
      descProduto: productData.descProduto,
      categoria: productData.categoria,
      precoProduto: productData.precoProduto,
      imageUrl: foundProduct.imageUrl,
      imagePublicId: foundProduct.imagePublicId!,
      tenantId: productData.tenantId,
      productId: productData.productId
    };

    await this.repo.patch(updateProductData);
    return;
  }

  async delete (id: string, tenantId: string) {
    return this.repo.delete(id, tenantId);
  }

  private formatProductsData (data: Produtos[]): FormatProductsData[] {
    return data.map(product => ({
      id: product.id,
      nomeProduto: product.nomeProduto,
      descProduto: product.descProduto,
      categoria: product.categoria,
      precoProduto: Number(product.precoProduto),
      imageUrl: product.imageUrl
    }));
  }

  private formatProductById (data: Produtos): FormatProductById {
    return {
      id: data.id,
      nomeProduto: data.nomeProduto,
      precoProduto: Number(data.precoProduto),
      descProduto: data.descProduto,
      categoria: data.categoria
    }
  }
}
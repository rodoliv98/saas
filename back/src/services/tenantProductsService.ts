import { IPatchProductDTO } from "../controllers/tenantProductsController";
import { ProductDTO } from "../controllers/tenantProductsController";
import { ITenantProductsRepository } from "../repository/tenantProductsRepository"
import { IFormatProductsData } from "../interfaces/products-interfaces/products-inter-index";
import { uploadToCloudinary } from "../integrations/cloudinary/cloudinary-upload";
import { IFormatProductById } from "../interfaces/products-interfaces/products-inter-index";
import { IProdutos } from "../controllers/tenantProductsController";
import { CustomError } from "../middlewares/errorHandler";
import { ErrorCode } from "../types/constants/error-codes-constants";

export interface ITenantProductsService {
  getProducts (id: string): Promise<IFormatProductsData[] | []>;
  getProductById (productId: string, tenantId: string): Promise<IFormatProductById>;
  create (product: ProductDTO): Promise<IProdutos>;
  patch (product: IPatchProductDTO, productId: string, tenantId: string): Promise<void>;
  delete (id: string, tenantId: string): Promise<IProdutos | null>;
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
    const cloudinaryData = await uploadToCloudinary(product.imagePath, null);
    const createdProduct = await this.repo.create(product, cloudinaryData);

    return createdProduct;
  }

  async patch (product: IPatchProductDTO, productId: string, tenantId: string) {
    const foundProduct = await this.repo.patch(product, productId, tenantId);
    if (!foundProduct) {
      throw new CustomError('Produto não encontrado', 404, ErrorCode.PRODUCT_NOT_FOUND);
    }

    return;
  }

  async delete (id: string, tenantId: string) {
    return this.repo.delete(id, tenantId);
  }

  private formatProductsData (data: IProdutos[]): IFormatProductsData[] {
    return data.map(product => ({
      id: product.id,
      nomeProduto: product.nomeProduto,
      descProduto: product.descProduto,
      categoria: product.categoria,
      precoProduto: Number(product.precoProduto),
      imageUrl: product.imageUrl
    }));
  }

  private formatProductById (data: IProdutos): IFormatProductById {
    return {
      id: data.id,
      nomeProduto: data.nomeProduto,
      precoProduto: Number(data.precoProduto),
      descProduto: data.descProduto,
      categoria: data.categoria
    }
  }
}
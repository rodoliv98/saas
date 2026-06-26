export interface PatchProductDTO {
  nomeProduto: string;
  descProduto: string;
  categoria: string;
  precoProduto: number;
  multerImagePath: string | undefined;
  tenantId: string;
  tenantSlug: string;
  productId: string;
}

export interface ProductDTO {
  categoria: string;
  descProduto: string;
  nomeProduto: string;
  precoProduto: number;
  tenantId: string;
  tenantSlug: string;
  imagePath: string;
}
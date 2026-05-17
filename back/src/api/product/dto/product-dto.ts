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
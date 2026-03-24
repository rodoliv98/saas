export interface FlavorImageData {
  imageUrl: string | null;
  imagePublicId: string | null;
}

export interface PatchFlavorData {
  nomeProduto: string;
  descProduto: string;
  precoProduto: number;
  categoria: string;
  imageUrl: string;
  imagePublicId: string | null;
}

export interface CreateFlavorData {
  nomeProduto: string;
  descProduto: string;
  precoProduto: number;
  categoria: string;
  imageUrl: string;
  imagePublicId: string | null;
  tenantId: string;
  productId: string;
}
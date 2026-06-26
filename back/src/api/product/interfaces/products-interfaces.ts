export interface FormatProductsData {
  id: string;
  nomeProduto: string;
  descProduto: string;
  categoria: string;
  precoProduto: number;
  imageUrl: string
}

export interface FormatProductById {
  id: string;
  nomeProduto: string;
  precoProduto: number;
  descProduto: string;
  categoria: string;
}
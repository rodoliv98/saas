export interface IFormatProductsData {
  id: string;
  nomeProduto: string;
  descProduto: string;
  categoria: string;
  precoProduto: number;
  imageUrl: string
}

export interface IFormatProductById {
  id: string;
  nomeProduto: string;
  precoProduto: number;
  descProduto: string;
  categoria: string;
}
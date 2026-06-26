export interface IFormatStoreData {
  store: {
    nomeFantasia: string | null;
    nomeEstabelecimento: string | null;
    endereco: string;
    isOpen: boolean;
    tempoPreparo: string;
    taxaEntrega: number;
    whatsapp: string;
    logoUrl: string | null;
    bannerUrl: string | null;
  },
  products: {
    id: string;
    nomeProduto: string;
    descProduto: string;
    precoProduto: number;
    categoria: string;
    imageUrl: string;
    sabores: {
      id: string;
      produtoId: string;
      nomeProduto: string;
      descProduto: string;
      imageUrl: string;
      categoria: string;
      precoProduto: number;
    }[]
  }[]
}
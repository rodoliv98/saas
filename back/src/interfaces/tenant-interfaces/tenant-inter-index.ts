import { Decimal } from "@prisma/client/runtime/library";
import { PedidoStatus } from "../../types/types-index";

export interface IFormatTenantData {
  endereco: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  municipio: string;
  estado: string;
  whatsapp: string;
  diasFuncionamento: string;
  horarioFuncionamento: string;
  tempoPreparo: string;
  taxaEntrega: number;
}

export interface IFormatStoreData {
  store: {
    nomeFantasia: string | null;
    endereco: string;
    isOpen: boolean;
    tempoPreparo: string;
    taxaEntrega: number;
    whatsapp: string;
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
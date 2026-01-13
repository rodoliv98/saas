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

export interface OrdersForDelivery {
  id: string;
  short_id: string | null;
  tenantSlug: string;
  nomeCompleto: string;
  endereco: string;
  bairro: string;
  cep: string;
  numero: string;
  complemento: string | null;
  whatsapp: string;
  formaPagamento: string;
  tipoEntrega: string;
  taxaEntrega: Decimal;
  totalOrderPrice: Decimal;
  observacao: string | null;
  status: PedidoStatus;
  createdAt: Date;
  updatedAt: Date;
  pin: string | null;
  userId: string;
}
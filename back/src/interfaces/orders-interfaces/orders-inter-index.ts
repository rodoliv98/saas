import { Decimal } from "@prisma/client/runtime/library";
import { PedidoStatus } from "../../types/types-index";

export interface IFormatGetOrdersData {
  id: string;
  nomeCompleto: string;
  endereco: string;
  bairro: string;
  cep: string;
  numero: string;
  complemento: string | null;
  whatsapp: string;
  formaPagamento: string;
  tipoEntrega: string;
  taxaEntrega: number;
  totalOrderPrice: number;
  observacao: string | null;
  status: string;
  pedidosItens: {
    nomeProduto: string;
    descProduto: string;
    categoria: string;
    quantidade: number;
    precoProduto: number;
    totalPrice: number;
    imageUrl: string;
    adicionais: {
      nomeProduto: string;
      descProduto: string;
      categoria: string;
      precoProduto: number;
    }[]
  }[];
}

export interface IGetUserOrders {
  id: string;
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
}
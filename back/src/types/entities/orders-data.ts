import { Decimal } from "@prisma/client/runtime/library";

export interface OrdersData {
  formaPagamento: string;
  taxaEntrega: Decimal;
  tipoEntrega: string;
  totalOrderPrice: Decimal;
  endereco: string;
  nomeCompleto: string;
  pedidosItens: {
    nomeProduto: string;
    quantidade: number;
    precoProduto: Decimal;
    subTotal: Decimal;
    imageUrl: string;
    itensAdicionais: {
      nomeProduto: string;
      precoProduto: Decimal;
    }[]
  }[]
}

export interface OrdersDelivery {
  short_id: string | null;
  nomeCompleto: string;
  endereco: string;
  bairro: string;
  numero: string;
  complemento: string | null;
  formaPagamento: string;
  totalOrderPrice: Decimal;
  pedidosItens: {
    nomeProduto: string;
    quantidade: number;
    itensAdicionais: {
      nomeProduto: string;
    }[]
  }[]
}
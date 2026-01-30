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
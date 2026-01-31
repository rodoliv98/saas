import { Decimal } from "@prisma/client/runtime/library";

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
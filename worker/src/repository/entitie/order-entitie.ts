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

type PedidoStatus = 
| "pendente"
| "preparando"
| "pronto"
| "entregando"
| "concluido"
| "cancelado"

export interface DeliveryUpdate {
  endereco: string;
  bairro: string;
  complemento: string | null;
  nomeCompleto: string;
  status: PedidoStatus;
}

export interface DeliveryMan {
  entregadores: {
    id: string;
  }[];
}

export interface ActivationCode {
  tenant_id: string;
  codigo: string;
  expire_date: Date;
  utilizado: boolean;
}
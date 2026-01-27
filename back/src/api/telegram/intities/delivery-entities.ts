import { PedidoStatus } from "../../../types/types-index";

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
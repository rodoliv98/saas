import { PedidoStatus } from "../types-index";

export interface UpdatedDelivery {
  nomeCompleto: string;
  endereco: string;
  bairro: string;
  complemento: string | null;
  status: PedidoStatus;
}
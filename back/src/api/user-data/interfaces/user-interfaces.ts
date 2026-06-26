import { PedidoStatus } from "../../../types/types-index";

export interface FormatUserData {
  user: {
    nomeCompleto: string;
    email: string;
  }
  pedidos: {
    id: string;
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
    status: PedidoStatus;
    pedidosItens: {
      nomeProduto: string;
      descProduto: string;
      quantidade: number;
      precoProduto: number;
      subTotal: number;
      imageUrl: string;
      itensAdicionais: {
        nomeProduto: string;
        descProduto: string;
        precoProduto: number;
      }[]
    }[]
  }[]
}

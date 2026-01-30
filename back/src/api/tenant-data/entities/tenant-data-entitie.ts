import { Decimal } from "@prisma/client/runtime/library";

export interface TenantData {
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
  pin: string | null;
}

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
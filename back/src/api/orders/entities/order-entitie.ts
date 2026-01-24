import { Decimal } from "../../../generated/prisma/internal/prismaNamespace";

export interface Orders {
  id: string;
  nomeCompleto: string;
  tipoEntrega: string;
  totalOrderPrice: Decimal;
  observacao: string | null;
  createdAt: Date;
  status: string;
  pedidosItens: {
    nomeProduto: string;
    descProduto: string;
    quantidade: number;
    itensAdicionais: {
      nomeProduto: string;
      descProduto: string;
    }[]
  }[]
}
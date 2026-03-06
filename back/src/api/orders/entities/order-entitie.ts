export interface Orders {
  id: string;
  nomeCompleto: string;
  tipoEntrega: string;
  totalOrderPrice: number;
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
import { Decimal } from "@prisma/client/runtime/library";

export interface Flavor {
  tenantId: string;
  id: string;
  produtoId: string;
  nomeProduto: string;
  descProduto: string;
  precoProduto: Decimal;
  categoria: string;
  imageUrl: string;
}
import { Decimal } from "@prisma/client/runtime/library";
import { Sabores } from "../../../generated/prisma/client";

/* export interface Flavor {
  tenantId: string;
  id: string;
  produtoId: string;
  nomeProduto: string;
  descProduto: string;
  precoProduto: Decimal;
  categoria: string;
  imageUrl: string;
}
 */
export type Flavor = Sabores;
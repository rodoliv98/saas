import { Decimal } from "../../../generated/prisma/internal/prismaNamespace"

export interface HomeOrders {
  totalOrderPrice: Decimal;
}

export interface HomeData {
  nomeRepresentante: string;
  trial: Date;
  tenantSlug: string;
  assinaturas: {
    planType: string | undefined;
    endDate: Date | undefined;
  }[]
}
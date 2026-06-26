import { Prisma } from "../../../generated/prisma/client";
import prisma from "../../../lib/prisma/client";

const args = {
  include: {
    sabores: true
  }
} satisfies Prisma.ProdutosDefaultArgs

export type ProductsWithFlavors = Prisma.ProdutosGetPayload<typeof args>;
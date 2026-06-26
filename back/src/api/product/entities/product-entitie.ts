import { Prisma } from "../../../generated/prisma/client";
import prisma from "../../../lib/prisma/prisma";

const args = {
  include: {
    sabores: true
  }
} satisfies Prisma.ProdutosDefaultArgs

export type ProductsWithFlavors = Prisma.ProdutosGetPayload<typeof args>;
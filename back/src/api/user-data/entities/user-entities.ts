import { Prisma } from "../../../generated/prisma/client";

const args = {
  include: {
    pedidos: {
      include: {
        pedidosItens: {
          include: {
            itensAdicionais: true
          }
        }
      }
    }
  }
} satisfies Prisma.UsersDefaultArgs;

export type UserAndItsRelations = Prisma.UsersGetPayload<typeof args>;
import { PrismaClient } from "../../generated/prisma/client";
import { UserAndItsRelations } from "./entities/user-entities";

export interface IUserDataRepository {
  getData (userId: string): Promise<UserAndItsRelations | null>;
}

export class UserDataRepository implements IUserDataRepository {
  constructor (private readonly prisma: PrismaClient) {}

  async getData (userId: string) {
    return this.prisma.users.findFirst({
      where: {
        id: userId
      },
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
    });
  }
}
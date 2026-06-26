import { UserRegisterType } from "../../types/types-index";
import { PrismaClient } from "../../generated/prisma/client";
import { Users } from "../../generated/prisma/client";

export interface IUserRegisterRepository {
  register (data: UserRegisterType, hashPass: string): Promise<Users>;
} 

export class UserRegisterRepository implements IUserRegisterRepository {
  constructor (private readonly prisma: PrismaClient) {}

  async register (data: UserRegisterType, hashPass: string) {
    return this.prisma.users.create({
      data: {
        nomeCompleto: data.nomeCompleto,
        email: data.email,
        senha: hashPass
      }
    });
  }
}
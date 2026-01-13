import { UserRegisterType } from "../types/types-index";
import { PrismaClient } from "../generated/prisma/client";
import { UserFromDB } from "../interfaces/users-interfaces/user-inter-index";

const prisma = new PrismaClient();

export interface IUserRegisterRepository {
  register (data: UserRegisterType, hashPass: string): Promise<UserFromDB>;
} 

export class UserRegisterRepository implements IUserRegisterRepository {
  async register (data: UserRegisterType, hashPass: string) {
    return prisma.users.create({
      data: {
        nomeCompleto: data.nomeCompleto,
        email: data.email,
        senha: hashPass
      }
    });
  }
}
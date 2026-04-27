import { PrismaClient } from "../../generated/prisma/client";
import { Admin } from "./types/admin-types";

export interface IAdminRepository {
  login (data: { username: string, senha: string }): Promise<Admin | null>
}

export class AdminRepository implements IAdminRepository {
  constructor (private readonly prisma: PrismaClient) {}

  async login (data: { username: string, senha: string }) {
    return this.prisma.admins.findUnique({
      where: {
        username: data.username
      }
    });
  }
}
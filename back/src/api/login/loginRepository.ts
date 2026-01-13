// arrumar o lugar do genreated
import { PrismaClient } from "../../generated/prisma/client";
import { IdType } from "../../types/types-index";
import { LoginDTO } from "./dto/login-dto";
import { TenantLogin, TenantRefresh } from "./entities/tenant";
import { UserLogin, UserRefresh } from "./entities/user";
import { CustomError } from "../../middlewares/errorHandler";
import { ErrorCode } from "../../types/constants/error-codes-constants";

export interface ILoginRepository {
  login (data: LoginDTO): Promise<TenantLogin | UserLogin | null>;
  refresh (id: IdType): Promise<TenantRefresh | UserRefresh>;
}

const prisma = new PrismaClient();

export class LoginRepository implements ILoginRepository {
  async login (data: LoginDTO): Promise<TenantLogin | UserLogin | null> {
    const tenantFromDb = await prisma.tenant.findUnique({
      where: {
        email: data.email
      },
      select: {
        id: true,
        senha: true,
        tenantSlug: true
      }
    });

    if (tenantFromDb !== null){
      const tenant = { ...tenantFromDb, kind: 'tenant' };
      return tenant;
    }

    const userFromDB = await prisma.users.findFirst({
      where: {
        email: data.email
      },
      select: {
        id: true,
        senha: true
      }
    });

    const user = { ...userFromDB, kind: 'user' };
    return user as UserLogin;
  }

  async refresh (tokenId: IdType): Promise<TenantRefresh | UserRefresh> {
    const identity = tokenId.role === 'user'
    ? await prisma.users.findFirst({
      where: { id: tokenId.id },
      select: { id: true }
    }) : await prisma.tenant.findFirst({
      where: { id: tokenId.id },
      select: { id: true, tenantSlug: true }
    });
    
    if (!identity) {
      throw new CustomError('Usuário não encontrado', 404, ErrorCode.NOT_FOUND);
    }

    return identity;
  }
}
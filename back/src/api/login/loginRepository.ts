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
}

export class LoginRepository implements ILoginRepository {
  constructor (private readonly prisma: PrismaClient) {}
  
  async login (data: LoginDTO): Promise<TenantLogin | UserLogin | null> {
    const tenantFromDb = await this.prisma.tenant.findUnique({
      where: {
        email: data.email
      },
      select: {
        id: true,
        senha: true,
        tenantSlug: true,
        active: true
      }
    });

    if (tenantFromDb !== null){
      const tenant = { ...tenantFromDb, kind: 'tenant' };
      return tenant;
    }

    const userFromDB = await this.prisma.users.findFirst({
      where: {
        email: data.email
      },
      select: {
        id: true,
        senha: true
      }
    });

    if (!userFromDB) {
      return null;
    }

    const user = { ...userFromDB, kind: 'user' };
    return user as UserLogin;
  }
}
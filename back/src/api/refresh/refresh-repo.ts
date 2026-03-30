import { PrismaClient } from "../../generated/prisma/client";
import { TenantRefresh } from "../login/entities/tenant";
import { UserRefresh } from "../login/entities/user";
import { CustomError } from "../../middlewares/errorHandler";
import { ErrorCode } from "../../types/constants/error-codes-constants";
import { IdType } from "../../types/types-index";

export interface IRefreshRepository {
  refresh (id: IdType): Promise<TenantRefresh | UserRefresh>;
}

export class RefreshRepository implements IRefreshRepository {
  constructor (private prisma: PrismaClient) {}
  
  async refresh (tokenId: IdType): Promise<TenantRefresh | UserRefresh> {
    const identity = tokenId.role === 'user'
    ? await this.prisma.users.findFirst({
      where: { id: tokenId.id },
      select: { id: true }
    }) : await this.prisma.tenant.findFirst({
      where: { id: tokenId.id },
      select: { id: true, tenantSlug: true }
    });
    
    if (!identity) {
      throw new CustomError('Usuário não encontrado', 404, ErrorCode.NOT_FOUND);
    }

    return identity;
  }
}
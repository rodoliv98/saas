import { createLoginToken, verifyToken } from "../../utils/tokenJWT";
import { JwtPayload } from "jsonwebtoken";
import { ErrorCode } from "../../types/constants/error-codes-constants";
import { CustomError } from "../../errors/errorHandler";
import { IRefreshRepository } from "./refresh-repo";
import { Identity } from "./types/refresh-types";

export interface IRefreshService {
  refresh (token: string): Promise<string[]>;
}

export class RefreshService implements IRefreshService {
  constructor (private repo: IRefreshRepository) {}

  async refresh (token: string): Promise<string[]> {
    const decoded = verifyToken(token) as JwtPayload;
    let identity;

    if (decoded.role == 'tenant') {
      identity = { table: 'tenant' as const, id: decoded.tenantId };
    } 
    else if (decoded.role == 'admin') {
      identity = { table: 'admins' as const, id: decoded.adminId };
    } 
    else {
      identity = { table: 'users' as const, id: decoded.userId };
    }
    
    const foundIdentity = await this.repo.refresh(identity);
    if (!foundIdentity) {
      throw new CustomError('Usuário não encontrado', 404, ErrorCode.NOT_FOUND);
    }

    return this.identityBasedToken(foundIdentity);
  }

  identityBasedToken (foundIdentity: Identity) {
    switch (foundIdentity.role) {
      case "user":
        return createLoginToken(foundIdentity.id, 'userId', 'user');
      case "tenant":
        return createLoginToken(foundIdentity.id, 'tenantId', 'tenant', foundIdentity.tenantSlug);
      case "admin":
        return createLoginToken(foundIdentity.id, 'adminId', 'admin');
    }
  }
}
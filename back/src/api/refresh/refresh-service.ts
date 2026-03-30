import { createLoginToken, verifyToken } from "../../utils/tokenJWT";
import { JwtPayload } from "jsonwebtoken";
import { ErrorCode } from "../../types/constants/error-codes-constants";
import { ITenantData } from "../../controllers/tenantStoreController";
import { CustomError } from "../../middlewares/errorHandler";
import { IRefreshRepository } from "./refresh-repo";

export interface IRefreshService {
  refresh (token: string): Promise<string[]>;
}

export class RefreshService implements IRefreshService {
  constructor (private repo: IRefreshRepository) {}

  async refresh (token: string): Promise<string[]> {
    const decodedToken = verifyToken(token) as JwtPayload;
    const identity = decodedToken.tenantId
    ? { role: 'tenant' as const, id: decodedToken.tenantId }
    : { role: 'user' as const, id: decodedToken.userId };

    const tenantOrUser = await this.repo.refresh(identity);
    if (!tenantOrUser) {
      throw new CustomError('Usuário não encontrado', 404, ErrorCode.NOT_FOUND);
    }

    const [accessToken, refreshToken] = identity.role === 'tenant'
    ? createLoginToken(tenantOrUser.id, (tenantOrUser as ITenantData).tenantSlug)
    : createLoginToken(tenantOrUser.id);

    return [accessToken, refreshToken];
  }
}
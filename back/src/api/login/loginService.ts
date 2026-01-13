import bcrypt from 'bcrypt'
import { LoginDTO } from './dto/login-dto' 
import { JwtPayload } from 'jsonwebtoken'
import { createLoginToken, verifyToken } from '../../utils/tokenJWT'
import { ILoginRepository } from './loginRepository' 
import { CustomError } from '../../middlewares/errorHandler'
import { ITenantData } from '../../controllers/tenantStoreController'
import { ErrorCode } from '../../types/constants/error-codes-constants'
import { TenantLogin } from './entities/tenant'

export interface ILoginService {
  login (data: LoginDTO): Promise<string[]>;
  refresh (token: string): Promise<string[]>;
}

export class LoginService implements ILoginService {
  constructor (private repo: ILoginRepository) {}

  async login (data: LoginDTO): Promise<string[]> {
    const tenantOrUser = await this.repo.login(data);
    if (!tenantOrUser) {
      throw new CustomError('Nenhum usuário encontrado com esse email', 404, ErrorCode.NOT_FOUND);
    }

    const decodedPassword = await bcrypt.compare(data.senha, tenantOrUser.senha);
    if (!decodedPassword) {
      throw new CustomError('Email ou senha inválida', 400, ErrorCode.BAD_REQUEST);
    }
    
    const identity = tenantOrUser.kind === 'tenant'
    ? { id: tenantOrUser.id, tenantSlug: (tenantOrUser as TenantLogin).tenantSlug }
    : { id: tenantOrUser.id };
    
    const [accessToken, refreshToken] = identity.tenantSlug 
    ? createLoginToken(identity.id, identity.tenantSlug)
    : createLoginToken(identity.id);

    return [accessToken, refreshToken];
  }

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
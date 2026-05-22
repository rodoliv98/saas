import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/tokenJWT";
import { JwtPayload } from "jsonwebtoken";
import { CustomError } from "../errors/errorHandler";
import { ErrorCode } from "../types/constants/error-codes-constants";

export function checkTenant (req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token || token == 'undefined') {
    next(new CustomError('Token não encontrado', 401, ErrorCode.TOKEN_NOT_FOUND));
    return;
  }

  const decoded = verifyToken(token) as JwtPayload;
  if (decoded.role != 'tenant') {
    next(new CustomError('Não autorizado', 403, ErrorCode.NOT_AUTHORIZED));
    return;
  }

  req.tenant = decoded.tenantId;
  req.slug = decoded.tenantSlug;
  req.role = decoded.role;

  next();
}

/*
o cookie deve ser enviado como none porque é de origem diferente
implementar um token contra CSRF
implementar corretamente os tokens de refresh
pesquisar o que é tampering e implementar rate limiting com 5 tentativas por min
implementar revogação de tokens
pesquisar sobre injeção de componentes e requisições autenticadas via fetch/xmlhttprequest
*/
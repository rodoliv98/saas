import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/tokenJWT";
import { JwtPayload } from "jsonwebtoken";

export function checkLogin (req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token || token == 'undefined') {
    return res.status(401).json({ error: 'Não autorizado', code: 'NOT_AUTHORIZED' });
  }

  const decoded = verifyToken(token) as JwtPayload;
  req.tenant = decoded.tenantId;
  req.slug = decoded.tenantSlug;
  req.user = decoded.userId;

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
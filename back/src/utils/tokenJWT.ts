import jwt from 'jsonwebtoken'
import { CustomError } from '../middlewares/errorHandler';

export function createLoginToken (id: string, slug?: string) {
  const secretJWT = process.env.JWT_SECRET as string;
  if (!secretJWT) throw new CustomError('Chave JWT não configurada', 500);

  const accessToken = slug 
  ? jwt.sign({ tenantId: id, tenantSlug: slug }, secretJWT, {
    expiresIn: '5m',
    algorithm: 'HS256',
    issuer: 'api.com.br',
    audience: 'eldur.com.br'
  })
  : jwt.sign({ userId: id }, secretJWT, {
    expiresIn: '5m',
    algorithm: 'HS256',
    issuer: 'api.com.br',
    audience: 'eldur.com.br'
  });

  const refreshToken = slug 
  ? jwt.sign({ tenantId: id }, secretJWT, {
    expiresIn: '7d',
    algorithm: 'HS256',
    issuer: 'api.com.br',
    audience: 'eldur.com.br'
  })
  : jwt.sign({ userId: id }, secretJWT, {
    expiresIn: '7d',
    algorithm: 'HS256',
    issuer: 'api.com.br',
    audience: 'eldur.com.br'
  });

  return [accessToken, refreshToken];
}

export function verifyToken (token: string) {
  const secretJWT = process.env.JWT_SECRET as string;
  if (!secretJWT) throw new CustomError('Chave JWT não configurada', 500);

  try {
    return jwt.verify(token, secretJWT, {
      algorithms: ['HS256'],
      issuer: 'api.com.br',
      audience: 'eldur.com.br'
    });
    
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      console.log('TokenExpiredError:\n', err);  
      throw new CustomError('Token expirado', 401, 'TOKEN_EXPIRED');
    }

    if (err.name === 'JsonWebTokenError') {
      console.log('JsonWebTokenError:\n', err);
      throw new CustomError('Token inválido', 401, 'INVALID_TOKEN')
    }

    console.log('Erro dentro da função verify JWT:\n', err);
    throw new CustomError();
  }
}
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/tokenJWT";
import { JwtPayload } from "jsonwebtoken";
import { ErrorCode } from "../types/constants/error-codes-constants";
import { CustomError } from "../errors/errorHandler";

export function checkUser (req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token || token == 'undefined') {
    next(new CustomError('Token não encontrado', 401, ErrorCode.TOKEN_NOT_FOUND));
    return;
  }
  
  const decoded = verifyToken(token) as JwtPayload;
  if (decoded.role != 'user') {
    next(new CustomError('Não autorizado', 403, ErrorCode.NOT_AUTHORIZED));
    return;
  }

  req.user = decoded.userId;

  next();
}
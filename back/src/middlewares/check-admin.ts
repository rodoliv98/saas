import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/tokenJWT";
import { JwtPayload } from "jsonwebtoken";
import { ErrorCode } from "../types/constants/error-codes-constants";

export async function checkAdmin (req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token || token == 'undefined') {
    return res.status(401).json({ error: 'Token não encontrado', code: ErrorCode.TOKEN_NOT_FOUND });
  }

  const decoded = verifyToken(token) as JwtPayload;
  if (decoded.role != 'admin') {
    return res.status(403).json({ error: 'Não autorizado', code: ErrorCode.NOT_AUTHORIZED });
  }

  req.admin = decoded.adminId;
  req.role = decoded.role;

  next();
}
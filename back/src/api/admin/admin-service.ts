import { CustomError } from "../../middlewares/errorHandler";
import { ErrorCode } from "../../types/constants/error-codes-constants";
import { IAdminRepository } from "./admin-repo";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Admin } from "./types/admin-types";

export interface IAdminService {
  login (data: { username: string, senha: string }): Promise<string[]>;
}

export class AdminService implements IAdminService {
  constructor (private repo: IAdminRepository) {}

  async login (data: { username: string, senha: string }) {
    const admin = await this.repo.login(data);
    if (!admin) {
      throw new CustomError('Credenciais inválidas', 404, ErrorCode.ADMIN_BAD_REQUEST);
    }
    
    const isMatch = bcrypt.compare(data.senha, admin.senha);
    if (!isMatch) {
      throw new CustomError('Credenciais inválidas', 404, ErrorCode.ADMIN_BAD_REQUEST);
    }

    return this.createToken(admin);
  }

  createToken (adminData: Admin) {
    const secretJWT = process.env.JWT_SECRET as string;
    if (!secretJWT) throw new CustomError('Chave JWT não configurada', 500);
    
    const accessToken = jwt.sign({ adminId: adminData.id }, secretJWT, {
      expiresIn: '15m',
      algorithm: 'HS256',
      issuer: 'api.com.br',
      audience: 'eldur.com.br'
    });

    const refreshToken = jwt.sign({ adminId: adminData.id }, secretJWT, {
      expiresIn: '7d',
      algorithm: 'HS256',
      issuer: 'api.com.br',
      audience: 'eldur.com.br'
    });

    return [accessToken, refreshToken];
  }
}
import { CustomError } from "../../middlewares/errorHandler";
import { ErrorCode } from "../../types/constants/error-codes-constants";
import { IAdminRepository } from "./admin-repo";
import { createLoginToken } from "../../utils/tokenJWT";
import { TenantAdminView } from "./types/admin-types";
import bcrypt from 'bcrypt';
import { Tenant } from "../../generated/prisma/client";

export interface IAdminService {
  login (data: { email: string, senha: string }): Promise<string[]>;
  findAllTenants (): Promise<TenantAdminView[]>;
  changeStoreStatus (tenantId: string, newStatus: boolean): Promise<Tenant>;
}

export class AdminService implements IAdminService {
  constructor (private repo: IAdminRepository) {}

  async login (data: { email: string, senha: string }) {
    const admin = await this.repo.login(data);
    if (!admin) {
      throw new CustomError('Credenciais inválidas', 404, ErrorCode.ADMIN_BAD_REQUEST);
    }
    
    const isMatch = await bcrypt.compare(data.senha, admin.senha);
    if (!isMatch) {
      throw new CustomError('Credenciais inválidas', 404, ErrorCode.ADMIN_BAD_REQUEST);
    }

    return createLoginToken(admin.id, 'adminId', 'admin');
  }

  async findAllTenants () {
    return this.repo.findAllTenants();
  }

  async changeStoreStatus (tenantId: string, newStatus: boolean) {
    const tenant = await this.repo.findTenant(tenantId);
    if (!tenant) {
      throw new CustomError('Tenant não encontrado na rota de admin', 404, ErrorCode.TENANT_NOT_FOUND);
    }
    
    return this.repo.changeStoreStatus(tenantId, newStatus);
  }
}
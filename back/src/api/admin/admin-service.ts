import { CustomError } from "../../errors/errorHandler";
import { ErrorCode } from "../../types/constants/error-codes-constants";
import { IAdminRepository } from "./admin-repo";
import { createLoginToken } from "../../utils/tokenJWT";
import { ActiveStatusResult, TenantAdminView } from "./types/admin-types";
import { Tenant } from "../../generated/prisma/client";
import * as bcrypt from 'bcrypt';

export interface IAdminService {
  login (data: { email: string, senha: string }): Promise<string[]>;
  findAllTenants (): Promise<TenantAdminView[]>;
  changeStoreStatus (tenantId: string, newStatus: boolean): Promise<Tenant>;
  changeStoreActiveStatus (tenantId: string, newActiveStatus: boolean): Promise<ActiveStatusResult>;
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

  async changeStoreStatus (tenantId: string, storeOpenStatus: boolean) {
    const tenant = await this.repo.findTenant(tenantId);
    if (!tenant) {
      throw new CustomError('Tenant não encontrado na rota de admin', 404, ErrorCode.TENANT_NOT_FOUND);
    }
    
    return this.repo.changeStoreStatus(tenantId, storeOpenStatus);
  }

  async changeStoreActiveStatus (tenantId: string, tenantActiveStatus: boolean) {
    const tenant = await this.repo.findTenant(tenantId);
    if (!tenant) {
      throw new CustomError('Tenant não encontrado na rota de admin', 404, ErrorCode.TENANT_NOT_FOUND);
    }

    const updatedTenant = await this.repo.changeStoreActiveStatus(tenantId, tenantActiveStatus);
    
    return updatedTenant.active === true
    ? 'A conta do tenant foi ativada'
    : 'A conta do tenant foi desativada';

  }
}
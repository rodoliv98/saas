import bcrypt from "bcrypt";
import { RegisterType } from "../../types/types-index";
import { IRegisterRepository } from "./register-repo";
import { apiCompare } from '../../utils/apiCompare';
import { Tenant } from "../../types/entities/tenant-entitie";

export interface IRegisterService {
  register (registerData: RegisterType): Promise<Tenant>;
}

export class RegisterService implements IRegisterService {
  constructor (private repo: IRegisterRepository) {}

  async register (registerData: RegisterType) {
    const string = JSON.stringify(registerData.diasFuncionamento);
    const hashedPassword = await bcrypt.hash(registerData.senha, 10);

    await apiCompare(registerData);

    const tenantData = {
      registerData,
      diasFuncionamento: string,
      password: hashedPassword
    };

    const tenant = await this.repo.register(tenantData);

    return tenant;
  }
}
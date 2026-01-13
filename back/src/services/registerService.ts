import bcrypt from "bcrypt"
import { RegisterType } from "../types/types-index";
import { IRegisterRepository } from '../repository/registerRepository'
import { ITenantData } from '../controllers/tenantStoreController';
import { apiCompare } from '../utils/apiCompare';

export interface IRegisterService {
  register (registerData: RegisterType): Promise<ITenantData>;
}

export class RegisterService implements IRegisterService {
  constructor (private repo: IRegisterRepository) {}

  async register (registerData: RegisterType) {
    const string = JSON.stringify(registerData.diasFuncionamento);
    const hashedPassword = await bcrypt.hash(registerData.senha, 10);

    await apiCompare(registerData);

    const tenant = await this.repo.register(registerData, string, hashedPassword);

    return tenant;
  }
}
import { RegisterType } from "../../../types/types-index";

export interface TenantCreationDTO {
  registerData: RegisterType;
  diasFuncionamento: string;
  password: string;
}
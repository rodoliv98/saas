import { PrismaClient } from "../generated/prisma/client"
import { RegisterType } from "../types/types-index";
import { ITenantData } from "../controllers/tenantStoreController";

export interface IRegisterRepository {
  register (registerData: RegisterType, diasFuncionamento: string, password: string): Promise<ITenantData>
}

const prisma = new PrismaClient();

export class RegisterRepository implements IRegisterRepository {
  async register (registerData: RegisterType, diasFuncionamento: string, password: string) {
    return prisma.tenant.create({
      data: {
        // passo 1
        nomeFantasia: registerData.nomeFantasia,
        razaoSocial: registerData.razaoSocial,
        CNPJ: registerData.CNPJ,
        inscricaoEstadual: registerData.inscricaoEstadual,
        // passo 2
        nomeRepresentante: registerData.nomeRepresentante,
        CPF: registerData.CPF,
        email: registerData.email,
        senha: password,
        telefone: registerData.telefone,
        // passo 3
        CEP: registerData.CEP,
        bairro: registerData.bairro,
        municipio: registerData.municipio,
        complemento: registerData.complemento,
        endereco: registerData.endereco,
        numero: registerData.numero,
        estado: registerData.estado,
        // passo 4
        tenantSlug: registerData.tenantSlug,
        diasFuncionamento: diasFuncionamento,
        horarioFuncionamento: registerData.horarioFuncionamento,
        tempoPreparo: registerData.tempoPreparo,
        taxaEntrega: registerData.taxaEntrega,
        whatsapp: registerData.whatsapp,
        admin: true // remover isso dps
      }
    });
  }
}
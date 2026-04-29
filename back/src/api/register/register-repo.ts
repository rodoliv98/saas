import { PrismaClient } from "../../generated/prisma/client";
import { Tenant } from "../../types/entities/tenant-entitie";
import { TenantCreationDTO } from "./dto/create-tenant-dto";

export interface IRegisterRepository {
  register (tenantData: TenantCreationDTO): Promise<Tenant>
}

export class RegisterRepository implements IRegisterRepository {
  constructor (private readonly prisma: PrismaClient) {}
  
  async register (tenantData: TenantCreationDTO) {
    const now = new Date();
    const FOURTEEN_DAYS_IN_MS = 14 * 24 * 60 * 60 * 1000;
    const expireTrialDate = new Date(now.getTime() + FOURTEEN_DAYS_IN_MS);

    return this.prisma.tenant.create({
      data: {
        // passo 1
        nomeFantasia: tenantData.registerData.nomeFantasia,
        razaoSocial: tenantData.registerData.razaoSocial,
        CNPJ: tenantData.registerData.CNPJ,
        inscricaoEstadual: tenantData.registerData.inscricaoEstadual,
        // passo 2
        nomeRepresentante: tenantData.registerData.nomeRepresentante,
        CPF: tenantData.registerData.CPF,
        email: tenantData.registerData.email,
        senha: tenantData.password,
        telefone: tenantData.registerData.telefone,
        // passo 3
        CEP: tenantData.registerData.CEP,
        bairro: tenantData.registerData.bairro,
        municipio: tenantData.registerData.municipio,
        complemento: tenantData.registerData.complemento,
        endereco: tenantData.registerData.endereco,
        numero: tenantData.registerData.numero,
        estado: tenantData.registerData.estado,
        // passo 4
        tenantSlug: tenantData.registerData.tenantSlug,
        nomeEstabelecimento: tenantData.registerData.nomeEstabelecimento,
        diasFuncionamento: tenantData.diasFuncionamento,
        horarioFuncionamento: tenantData.registerData.horarioFuncionamento,
        tempoPreparo: tenantData.registerData.tempoPreparo,
        taxaEntrega: tenantData.registerData.taxaEntrega,
        whatsapp: tenantData.registerData.whatsapp,
        trial: expireTrialDate
      }
    });
  }
}
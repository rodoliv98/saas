import bcrypt from "bcrypt";
import { RegisterType } from "../../types/types-index";
import { IRegisterRepository } from "./register-repo";
import { Tenant } from "../../types/entities/tenant-entitie";
import { CustomError } from "../../errors/errorHandler";
import { ErrorCode } from "../../types/constants/error-codes-constants";

export interface IRegisterService {
  register (registerData: RegisterType): Promise<Tenant>;
}

export class RegisterService implements IRegisterService {
  constructor (private repo: IRegisterRepository) {}

  async register (registerData: RegisterType) {
    const string = JSON.stringify(registerData.diasFuncionamento);
    const hashedPassword = await bcrypt.hash(registerData.senha, 10);

    const tenantData = {
      registerData,
      diasFuncionamento: string,
      password: hashedPassword
    };
    
    const tenant = await this.repo.register(tenantData);
    await this.notifyDiscord(tenant);
    
    return tenant;
  }

  async notifyDiscord (tenant: Tenant) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      throw new CustomError('Url do webhook não configurada', 500, ErrorCode.INTERNAL_SERVER_ERROR);
    }
    
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        embeds: [{
          title: 'Nova conta criada',
          color: 0xFF6600,
          fields: [
            { name: 'Tenant ID', value: `${tenant.id}` },
            { name: 'Nome Fantasia', value: `${tenant.nomeFantasia}` },
            { name: 'Razão Social', value: `${tenant.razaoSocial}` },
            { name: 'CNPJ', value: `${tenant.CNPJ}` },
            { name: 'Inscrição Estadual', value: `${tenant.inscricaoEstadual}` },
            { name: 'Nome do Representante', value: `${tenant.nomeRepresentante}` },
            { name: 'CPF', value: `${tenant.CPF}` },
            { name: 'Email', value: `${tenant.email}` },
            { name: 'Telefone', value: `${tenant.telefone}` },
            { name: 'Endereço', value: `${tenant.endereco}` },
            { name: 'Número do local', value: `${tenant.numero}` },
            { name: 'Bairro', value: `${tenant.bairro}` },
            { name: 'Municipio', value: `${tenant.municipio}` },
            { name: 'Estado', value: `${tenant.estado}` },
            { name: 'CEP', value: `${tenant.CEP}` },
            { name: 'Slug', value: `${tenant.tenantSlug}` },
          ],
          timestamp: new Date().toISOString()
        }]
      })
    })

    if (!res.ok) {
      throw new CustomError('Erro ao enviar notificação no Discord', 502, ErrorCode.DISCORD_NOTIFICATION_ERROR);
    }
  }
}